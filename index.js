var LocalFiles = function(){
    var mainObject = this;
    this.bufferObject = {};
    this.copyObject = {};
    this.standardFileObject = {
        getName:function(){
            return this.handle.name;
        },
        getType:function(){
            return "file";
        },
        delete:function(){
            var textError =  "This "+this.getType()+" cannot be removed";
    
            type == 0 || type == undefined ? this.handle.remove() : 
            type == 1 ? this.folder.removeEntry(this.name) :
            console.error(textError);
        },
        cut:async function(type){     
            var cutFile = this;                   
            this.copy().then(function(result){
                cutFile.delete(type);
            });
        },
        copy:async function(){
            var currentFile = await this.handle.getFile();
            var content = await currentFile.arrayBuffer();
    
            mainObject.copyObject = {handle:content,folder:"root",name:this.getName(),type:this.getType(),}
        },    
        buffer:async function(){
            var currentFile = await this.handle.getFile();
            var content = await currentFile.arrayBuffer();
    
            mainObject.bufferObject = {handle:content,folder:"root",name:this.getName(),type:this.getType(),}
        },
        move:function(folder){
            if(type == 0 || type == undefined){
                this.handle.move(folder.handle);
            }else if(type == 1){
                var movedFolder = this;                   
                this.buffer().then(function(result){
                    movedFolder.delete(1);
                    folder.place();
                });
            }
        },
        rename:async function(name,type){
            if(type == 0 || type == undefined){
                this.handle.move(name);
            }else if(type == 1){
                var movedFolder = this;                   
                this.buffer().then(async function(result){
                    movedFolder.delete(1);
                    var mainFolder = await movedFolder.folder;
    
                    var newFile = await mainFolder.getFileHandle(name,{create:true});
    
                    var write = await newFile.createWritable();
                    await write.write(mainObject.bufferObject.handle);
                    await write.close();
                });
            }
        },
        write:async function(content){
            var write = await this.handle.createWritable();
            await write.write(content);
            await write.close();
        },
        read:async function(){
            return await this.handle.getFile();
        },
        save:async function(options){
            var newFile = await window.showSaveFilePicker(options);
            var currentFile = await this.handle.getFile();
            var content = await currentFile.arrayBuffer();
    
            var write = await newFile.createWritable();
            await write.write(content);
            await write.close();
        },
        download:async function(name){
            this.read().then(function(result){
                var link = document.createElement("a");
                link.download = name;
                link.href = URL.createObjectURL(result);
                link.click();
                link.parentNode.removeChild(link);
            });
        },
    }

    this.standardFolderObject = {
        getName:function(){
            return this.handle.name;
        },
        getType:function(){
            return "folder";
        },
        delete:function(type){
            var textError = "This "+this.getType()+" cannot be removed";
    
            type == 0 || type == undefined ? this.handle.remove() : 
            type == 1 ? this.folder.removeEntry(this.name,{recursive:true}) :
            console.error(textError);
        },
        cut:async function(type){     
            var cutFolder = this;                   
            this.copy().then(function(){
                cutFolder.delete(type);
            });
        },
        copy:async function(){
            mainObject.copyObject = {handle:"virtual",folder:"root",name:this.getName(),type:this.getType(),entries:await mainObject.copyFolder(this.handle),}
        },
        paste:async function(name){
            if(mainObject.copyObject.type == "folder"){
                var mainFolder = await this.handle.getDirectoryHandle(name == undefined ? mainObject.copyObject.name+" (copy)" : name,{create:true});
                await mainObject.pasteFolder(mainFolder,mainObject.copyObject);
            }else{
                var mainFolder = await this.handle;
                var newFile = await mainFolder.getFileHandle(mainObject.copyObject.name,{create:true});
    
                var write = await newFile.createWritable();
                await write.write(mainObject.copyObject.handle);
                await write.close();
            }
        },
        buffer:async function(){
            mainObject.bufferObject = {handle:"virtual",folder:"root",name:this.getName(),type:this.getType(),entries:await mainObject.copyFolder(this.handle),}
        },
        place:async function(){
            if(mainObject.bufferObject.type == "folder"){
                var mainFolder = await this.handle.getDirectoryHandle(mainObject.bufferObject.name,{create:true});
                await mainObject.pasteFolder(mainFolder,mainObject.bufferObject);
            }else{
                var mainFolder = await this.handle;
                var newFile = await mainFolder.getFileHandle(mainObject.bufferObject.name,{create:true});
    
                var write = await newFile.createWritable();
                await write.write(mainObject.bufferObject.handle);
                await write.close();
            }
        },
        rename:async function(name,type){
            if(type == 0 || type == undefined){
                this.handle.move(name);
            }else if(type == 1){
                var movedFolder = this;                   
                this.buffer().then(async function(){
                    movedFolder.delete(1);
                    var mainFolder = await movedFolder.folder.getDirectoryHandle(name,{create:true});
                    await mainObject.pasteFolder(mainFolder,mainObject.bufferObject);
                });
            }
        },
        update:async function(){
            this.entries.length = 0;
            this.entries = await mainObject.sweepFolder(this.handle);
        },
        new:async function(type,name,content){
            var textError = "This folder cannot create "+type+"s";
    
            if(type == "folder")await this.handle.getDirectoryHandle(name,{create:true});
            if(type == "file")var newFile = await this.handle.getFileHandle(name,{create:true});
            if(type == undefined || name == undefined)console.error(textError);
    
            if(content != undefined){
                var write = await newFile.createWritable();
                await write.write(content);
                await write.close();
            }
        },
        move:function(folder,type){
            if(type == 0 || type == undefined){
                this.handle.move(folder.handle);
            }else if(type == 1){
                var movedFolder = this;                   
                this.buffer().then(function(result){
                    movedFolder.delete(1);
                    folder.place();
                });
            }
        },
        //save and download (zip) functions coming soon and get size ouou
    }

    this.openFile = async function(options){
        var currentFile = await window.showOpenFilePicker(options);
        return {handle:currentFile[0],folder:"root",...Object.assign({},mainObject.standardFileObject),}
    }

    this.openFolder = async function(options){
        var currentFolder = await window.showDirectoryPicker(options);
        return {handle:currentFolder,folder:"root",entries:await mainObject.sweepFolder(currentFolder),...Object.assign({},mainObject.standardFolderObject),}
    }

    this.pasteFolder = async function(folder,entries){
        for(var i in entries.entries){
            if(entries.entries[i].type == "folder"){
                var subFolder = await folder.getDirectoryHandle(entries.entries[i].name,{create:true});
                await mainObject.pasteFolder(subFolder,entries.entries[i]);
            }else if(entries.entries[i].type == "file"){
                var newFile = await folder.getFileHandle(entries.entries[i].name,{create:true});
                var write = await newFile.createWritable();
                await write.write(entries.entries[i].handle);
                await write.close();
            }
        }
    }

    this.copyFolder = async function(folder){
        var filesAndFolders = [];
        for await(var[name,handle] of folder){
            if(handle.kind == "directory"){
                filesAndFolders.push({handle:"virtual",folder:folder.name,name:name,type:"folder",entries:await mainObject.copyFolder(handle),});
            }else if(handle.kind == "file"){
                var file = await handle.getFile();
                var content = await file.arrayBuffer();
                filesAndFolders.push({handle:content,folder:folder.name,name:name,type:"file",});
            }
        }
        return filesAndFolders;
    }

    this.sweepFolder = async function(folder){
        var filesAndFolders = [];
        for await(var[name,handle] of folder){
            if(handle.kind == "directory"){
                filesAndFolders.push({handle:handle,folder:folder,entries:[...await mainObject.sweepFolder(handle)],...Object.assign({},mainObject.standardFolderObject)});
            }else if(handle.kind == "file"){
                filesAndFolders.push({handle:handle,folder:folder,...Object.assign({},mainObject.standardFileObject)});
            }
        }
        return filesAndFolders;
    }
}
