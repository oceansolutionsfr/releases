// specific js for media
// @since   2020-12-19
// @author  sebastien.mamy@gmail.com
//



_Lake.register("natural person",         {..._Node});
_Lake.register("legal entity",           {..._Node});
_Lake.register("identity",               {..._Node});
_Lake.register("musical work",           {..._Node});
_Lake.register("sound recording",        {..._Node});
_Lake.register("digital asset",          {..._Node});
_Lake.register("album",                  {..._Node});
_Lake.register("agreement",              {..._Node});
_Lake.register("identifier",             {..._Node});

_Lake.register("has share",              {..._Edge});
_Lake.register("contains",               {..._Edge});
_Lake.register("identifies",             {..._Edge});
_Lake.register("made of",                {..._Edge});
_Lake.register("manifestation of",       {..._Edge});






/// create indexes from a data lake
/// @returns        void
/// @side-effects   __indexes
window._IndexLibrary = () => 
{
    _Index.creator = {};
    _Index.performer = {};

    Object.values(_Index["has share"]).reduce((nul, item) => {
        if(_Index.all[item.target].type === "musical work") _Index.creator[item.source] = [..._Index.creator[item.source], item.target];
        else if(_Index.all[item.target].type === "sound recording") _Index.performer[item.source] = [..._Index.performer[item.source], item.target]; 
    },null);
}

























window._similarity = (s1, s2) => 
{
    s1 = s1.split(" ").join("").toUpperCase();
    s2 = s2.split(" ").join("").toUpperCase();
    if(s1 === s2) return 1;
    if(s1.indexOf(s2) >= 0 || s2.indexOf(s1) >=0) return 0.5;
    return 0;
}

window._duplicates = (item, threshold = 50) => {
    let duplicates = [];
    for(let id in __lake.data[item.model]) 
    {
        let total = 0, identical = 0, similar = 0;
        let item2 = __lake.data[item.model][id];
        for(let property in item) 
        {
            total++;
            if(!item2.hasOwnProperty(property))
            {

            } else if(property.startsWith("@"))
            {

            } else 
            {
                let value, v2;
                if(_typeof(property) === "array") 
                {
                    value = JSON.stringify(item[property].sort());
                    v2 = JSON.stringify(item2[property].sort());
                }
                else 
                {
                    value = JSON.stringify(item[property]);
                    v2 = JSON.stringify(item2[property]);                    
                }
                if(value === v2) identical++;
                else if(_similarity(value, v2) > 0) similar++;
            }
        }
        let score = total === 0 ? 0 : Math.floor(100*(identical + (similar / 2.0)) / total);
        if(score > threshold) duplicates.push(item2);
    }
    return duplicates;
}


/// load files upon drop event
/// @returns        void | uploaded assests
/// @side-effects   __lake
window._LoadFiles = (drop_event) => 
{
    console.log(">>>> In _LoadFiles");
    if(event.target.files.length === 1 && event.target.files[0].name.endsWith(".json")) 
    {
        let reader = new FileReader();
        reader.onload = (event) => {
            _out(JSON.parse(event.target.result));
            _IndexLibrary();
            window.apps.Message("success","" + new Intl.NumberFormat().format(_size(__lake.data.products)) + " items loaded successfully");    
        }
        reader.readAsText(event.target.files[0]);
        return;
    } 
    
    for(let file of event.target.files)
    {
        let extension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase(),
            fields = file.name.substring(0,file.name.lastIndexOf('.')).split(","),
            reads = {};
        switch(extension)
        {
            case ".mp3":                
                reads.performers   = fields[0].split("|");
                switch(fields.length)
                {
                    case 3: // performer, title, creator
                        reads.creator=   fields[2].trim();
                    case 2:  // performer, title
                        reads.title=     fields[1].trim();
                        break;
                    case 4: // performer, album, track, title
                        reads.album =     fields[1].trim();
                        reads.track =     fields[2].trim();
                        reads.title =     fields[3].trim();
                        
                        break;
                    case 6: // performer, album, track, title, identifier, creator
                        reads.album =     fields[1].trim();
                        reads.track =     fields[2].trim();
                        reads.title =     fields[3].trim();
                        reads.identifier= fields[4].trim();
                        reads.creator =   fields[5].trim();
                        break;
                }
                let asset = _Factory.create("digital asset", {qualities: ["uri::" + __lake.asset_dir + "/Sound/" + file.name.toUpperCase()[0] + "/" + encodeURIComponent(file.name)]});
                console.log(_duplicates(asset,50));
                _add(asset);

                let srtitle = _Factory.create("original title", {value: reads.title}),
                    soundrecording = _Factory.create("sound recording", {label: new Array(srtitle.id)});
                _duplicates(soundrecording,50);
                _add(_Factory.create("contains", {"@source": asset.id, "@target": soundrecording.id, qualities: ["usage::10000"]}));
                if(reads.hasOwnProperty("album")) 
                {
                    let altitle = _Factory.create("original title", {value: reads.album}),
                        album = _Factory.create("album", {label: new Array(altitle.id)});
                    _Factory.create("made of", {"@source": album.id, "@target": soundrecording.id, qualitites: new Array("track::" + reads.track)});                 
                }

                if(reads.hasOwnProperty("creator")) 
                {
                    let mwtitle = _Factory.create("original title", {value: reads.title}),
                        musicalwork = _Factory.create("musical work", {label: new Array(mwtitle.id)}),
                        creatorname = _Factory.create("patronym", {value: reads.creator}),
                        creator = _Factory.create("entity", {label: new Array(creatorname.id)});
                    _Factory.create("is manifestation of", {"@source": soundrecording.id, "@target": musicalwork.id, qualities:["weight::10000"]});
                    _Factory.create("has share", {"@source": creator.id, "@target": musicalwork.id, qualities:["share::10000"]});
                }
                
                for(let name of reads.performers)
                {
                    let performer = _Factory.create("identity", {labels:["main::"+name]})
                    _Factory.create("has share", {"@source": performer.id, "@target": soundrecording.id, qualities:["role::artist","share::" + Math.floor(10000/reads.performers.length)]});
                }               


                
                

                

                break;
            default:
                _out(412, "unknown file extension", extension);
        } 




        /*



        let nature = _default(window.apps.FileNature[extension.toUpperCase()],"Misc");
        let asset = {
            nature:             nature,       
            mime_type:          extension,     
            uri:                window.data.library.basedir + "/" + nature + "/" + file.name.trim()[0].toUpperCase() + "/" + encodeURIComponent(file.name),       
            quality:            "digital"
        };             
        asset = {...asset, ...window.apps.ParseFile[nature](file.name.substring(0,file.name.lastIndexOf('.')).split(","))};    
        
        return asset;*/
    }
    _IndexLibrary();
    event.target.value = "";
    
}



let _methods = 
{
    
    


    /// parse a file name and creates the related data in the lake
    /// @returns        void
    /// @functional     side-effects: data.lake
    ParseFileName : (file_name) => {
        let   library = _values(_select((item) => item.model === "Library"));
        if(_size(library) === 0) {
            library = _new({model:"Library", basedirectory : "/Volumes/Oceans/Medias"});
            _insert(library);
        } else library = _values(library)[0];
        let   fields = file_name.substring(0,file_name.lastIndexOf('.')).split(","),
                extension=     file_name.substring(file_name.lastIndexOf('.')).toLowerCase();
        const   type = _data.MEDIA_TYPES[extension],
                source = library.basedirectory + "/" + file_name.toUpperCase()[0] + "/" + file_name;
        let asset = _select((item) => item.source === source);
        if(_size(asset) === 1) return;
        asset = _new({source: source, model: "Asset", type: type});
        _insert(asset);
        switch(type) {
            case "Audio":
                let title = "", performers = null;
                fields = fields.map((field) => field.trim());
                switch(fields.length) 
                {
                    case 1:
                        title = _clean(fields[0]);
                        break;
                    case 3: // performer, title, creator
                        //_read.attributes.creators=  fields[2]?.split("|");
                    case 2: // performer, title
                        performers = _map(fields[0].split("|"), (item) => item.trim());
                        title= fields[1];
                    case 4: // performer, album, track, title
                        performers = _map(fields[0].split("|"), (item) => item.trim());
                        //_read.attributes.album =    fields[1];
                        //_read.attributes.track =    fields[2];
                        title= fields[3];
                        break;
                    case 6: // performer, album, track, title, identifier, creator
                        performers = _map(fields[0].split("|"), (item) => item.trim());
                        //_read.attributes.album =    fields[1];
                        //_read.attributes.track =    fields[2]
                        title =               fields[3];
                        //_read.identifiers =         { default: fields[4] };
                        //_read.attributes.creators=  fields[5]?.split("|");
                        break;
                }
                asset.titles = [title];
                _reduce(performers,([],performer_name) => 
                {
                    let performer = _select((item) => item.names && item.names.includes(performer_name));
                    if(_size(performer) === 0) 
                    {
                        performer = _new({model: "Entity", names: [performer_name]});
                        _insert(performer);
                        performer.links[asset.uid] = {performs : {}};
                    } else if(_size(performer === 1) && !(performer[0].links[asset.uid] && performer[0].links[asset.uid].performs)) performer[0].links[asset.uid] = {performs : {}};
                    else {
                        console.log(__lake, new Error().stack);
                        throw "not implemented";
                    }
                });
                break;
        }
        //console.log(_lake());
        _out(600, "data lake", __lake, false);
    }

}