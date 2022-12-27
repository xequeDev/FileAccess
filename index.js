var LocalFiles = function(){
    var mainObject    = this;
    this.bufferObject = {  };
    this.copyObject   = {  };

    this.openFile = async function(options){
        var openFile = await window.showOpenFilePicker(options);

        var file = {
            handle:                                    openFile[0],
            folder:                                         "root",
            name:                                 openFile[0].name,
            type:                                           "file",
            getName:function(){
                return this.handle.name;
            },
            save:async function(options){
                var newFile = await window.showSaveFilePicker(options);
                var file = await this.handle.getFile();
                var content = await file.arrayBuffer();

                var write = await newFile.createWritable();
                await write.write(content);
                await write.close();
            },
            write:async function(content){
                var file = await this.handle;
    
                var write = await file.createWritable();
                await write.write(content);
                await write.close();
            },
            read:async function(type){
                var file = await this.handle.getFile();

                if(type == undefined || type == 0 || type == "blob" || type == "file"){
                    return file;
                }else if(type == 1 || type == "text"){
                    return await file.text();
                }else if(type == 2 || type == "arrayBuffer"){
                    return await file.arrayBuffer();
                }
            },
            delete:async function(){
                await this.handle.remove();
            },
            rename:async function(name,type){
                if(type == 0 || type == undefined){
                    this.handle.move(name);
                }else if(type == 1){
                    var textError = "This file cannot be renamed";

                    console.error(textError);
                }
            },
            move:function(){
                var textError = "This file cannot be moved";

                console.error(textError);
            },
            buffer:async function(){
                var file = await this.handle.getFile();
                var content = await file.arrayBuffer();

                mainObject.bufferObject = {
                    handle:                                content,
                    folder:                                 "root",
                    name:                            openFile.name,
                    type:                                   "file",
                }
            },
            cut:async function(){     
                var cutFolder = this;                   
                this.copy().then(function(result){
                    cutFolder.delete();
                });
            },
            copy:async function(){
                var file = await this.handle.getFile();
                var content = await file.arrayBuffer();

                mainObject.copyObject = {
                    handle:                                content,
                    folder:                                 "root",
                    name:                            openFile.name,
                    type:                                   "file",
                }
            },
        }
        return file;
    }

    this.openFolder =  async function(options){
        var openFolder = await window.showDirectoryPicker(options);
        var sweep      =  await mainObject.sweepFolder(openFolder);

        var folder = {
            handle:                                     openFolder,
            folder:                                         "root",
            name:                                  openFolder.name,
            type:                                         "folder",
            entries:[                                    ...sweep],
            getName:function(){
                return this.handle.name;
            },
            delete:async function(){
                await this.handle.remove();
            },
            rename:async function(name,type){
                if(type == 0 || type == undefined){
                    this.handle.move(name);
                }else if(type == 1){
                    var textError = "This folder cannot be renamed copy it instead of moving it";

                    console.error(textError);
                }
            },
            update:async function(){
                sweep  =  await mainObject.sweepFolder(openFolder);

                this.entries.length =          0;
                this.entries        = [...sweep];
            },
            create:async function(type,name,content){
                var textError = "This folder cannot create "+type+"s";

                if(type == "folder")           this.handle.getDirectoryHandle(name,{create:true});
                if(type == "file") var file = await this.handle.getFileHandle(name,{create:true});
                if(type == undefined || name == undefined)               console.error(textError);

                if(content != undefined){
                    var write = await file.createWritable();
                    await write.write(content);
                    await write.close();
                }
            },
            move:function(){
                var textError = "This folder cannot be moved copy it instead of moving it";

                console.error(textError);
            },
            buffer:async function(){
                var buffer = await mainObject.copyFolder(openFolder);

                mainObject.bufferObject = {
                    handle:                              "virtual",
                    folder:                                 "root",
                    name:                          openFolder.name,
                    type:                                 "folder",
                    entries:[                           ...buffer],
                }
            },
            place:async function(){
                if(mainObject.bufferObject.type == "folder"){
                    var mainFolder = 
                        await this.handle.getDirectoryHandle(mainObject.bufferObject.name,{create:true});

                    await mainObject.pasteFolder(mainFolder,mainObject.bufferObject);
                }else{
                    var mainFolder = 
                        await this.handle;

                    var file = await mainFolder.getFileHandle(mainObject.bufferObject.name,{create:true});

                    var write = await file.createWritable();
                    await write.write(mainObject.bufferObject.handle);
                    await write.close();
                }
            },
            cut:async function(type){     
                var cutFolder = this;                   
                this.copy().then(function(result){
                    cutFolder.delete(type);
                });
            },
            copy:async function(){
                var copy = await mainObject.copyFolder(openFolder);

                mainObject.copyObject = {
                    handle:                              "virtual",
                    folder:                                 "root",
                    name:                          openFolder.name,
                    type:                                 "folder",
                    entries:[                             ...copy],
                }
            },
            paste:async function(name){
                if(mainObject.copyObject.type == "folder"){
                    var mainFolder = 
                        await this.handle.getDirectoryHandle(name == undefined ? mainObject.copyObject.name+" (copy)" : name,{create:true});

                    await mainObject.pasteFolder(mainFolder,mainObject.copyObject);
                }else{
                    var mainFolder = 
                        await this.handle;

                    var file = await mainFolder.getFileHandle(mainObject.copyObject.name,{create:true});

                    var write = await file.createWritable();
                    await write.write(mainObject.copyObject.handle);
                    await write.close();
                }
            },
        }
        return folder;
    }

    this.pasteFolder = async function(folder,entries){
        for(var i in entries.entries){
            if(entries.entries[i].type == "folder"){
                var subFolder = await folder.getDirectoryHandle(entries.entries[i].name,{create:true});

                await mainObject.pasteFolder(subFolder,entries.entries[i]);
            }else if(entries.entries[i].type == "file"){
                var file = await folder.getFileHandle(entries.entries[i].name,{create:true});

                var write = await file.createWritable();
                await write.write(entries.entries[i].handle);
                await write.close();
            }
        }
    }

    this.copyFolder = async function(folder){
        var filesAndFolders = [];

        for await(var[name,handle] of folder){
            if(handle.kind == "directory"){
                var copy     = await mainObject.copyFolder(handle);

                filesAndFolders.push({
                    handle:                              "virtual",
                    folder:                            folder.name,
                    name:                                     name,
                    type:                                 "folder",
                    entries:[                             ...copy],
                });
            }else if(handle.kind == "file"){
                var file = await      handle.getFile();
                var content = await file.arrayBuffer();

                filesAndFolders.push({
                    handle:                          await content,
                    folder:                            folder.name,
                    name:                                     name,
                    type:                                   "file",
                });
            }
        }
        return filesAndFolders;
    }

    this.sweepFolder = async function(folder){
        var filesAndFolders = [];

        for await(var[name,handle] of folder){
            if(handle.kind == "directory"){
                var sweep  = await mainObject.sweepFolder(handle);

                filesAndFolders.push({
                    handle:                                 handle,
                    folder:                                 folder,
                    name:                                     name,
                    type:                                 "folder",
                    entries:[                            ...sweep],
                    getName:function(){
                        return this.handle.name;
                    },
                    delete:function(type){
                        var textError =          "This "+this.type+" cannot be removed!";

                        type == 0 || type == undefined ?           this.handle.remove() : 
                        type == 1 ? this.folder.removeEntry(this.name,{recursive:true}) :
                        console.error(textError);
                    },
                    update:async function(){
                        sweep  =  await  mainObject.sweepFolder(openFolder);

                        this.entries.length = 0;
                        this.entries = [...sweep]
                    },
                    create:async function(type,name,content){
                        var textError = "This folder cannot create "+type+"s";
        
                        if(type == "folder")            this.handle.getDirectoryHandle(name,{create:true});
                        if(type == "file") var file = await this.handle.getFileHandle(name,{create:true});
                        if(type == undefined || name == undefined)                console.error(textError);
        
                        if(content != undefined){
                            var write = await file.createWritable();
                            await write.write(content);
                            await write.close();
                        }
                    },        
                    cut:async function(type){     
                        var cutFolder = this;                   
                        this.copy().then(function(result){
                            cutFolder.delete(type);
                        });
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
                    rename:async function(name,type){
                        if(type == 0 || type == undefined){
                            this.handle.move(name);
                        }else if(type == 1){
                            var movedFolder = this;                   
                            this.buffer().then(async function(result){
                                movedFolder.delete(1);
                                var mainFolder = 
                                    await movedFolder.folder.getDirectoryHandle(name,{create:true});
        
                                await mainObject.pasteFolder(mainFolder,mainObject.bufferObject);
                            });
                        }
                    },
                    buffer:async function(){
                        var buffer = await mainObject.copyFolder(this.handle);
        
                        mainObject.bufferObject = {
                            handle:                              "virtual",
                            folder:                                 "root",
                            name:                         this.handle.name,
                            type:                                 "folder",
                            entries:[                           ...buffer],
                        }
                    },
                    place:async function(){
                        if(mainObject.bufferObject.type == "folder"){
                            var mainFolder = 
                                await this.handle.getDirectoryHandle(mainObject.bufferObject.name,{create:true});
        
                            await mainObject.pasteFolder(mainFolder,mainObject.bufferObject);
                        }else{
                            var mainFolder = 
                                await this.handle;
        
                            var file = await mainFolder.getFileHandle(mainObject.bufferObject.name,{create:true});
        
                            var write = await file.createWritable();
                            await write.write(mainObject.bufferObject.handle);
                            await write.close();
                        }
                    },
                    copy:async function(){
                        var copy = await mainObject.copyFolder(this.handle);

                        mainObject.copyObject = {
                            handle:                               "virtual",
                            folder:                                  "root",
                            name:                          this.handle.name,
                            type:                                  "folder",
                            entries:[                              ...copy],
                        }
                    },
                    paste:async function(name){
                        if(mainObject.copyObject.type == "folder"){
                            var mainFolder = 
                                await this.handle.getDirectoryHandle(name == undefined ? mainObject.copyObject.name+" (copy)" : name,{create:true});
        
                            await mainObject.pasteFolder(mainFolder,mainObject.copyObject);
                        }else{
                            var mainFolder = 
                                await this.handle;
        
                            var file = await mainFolder.getFileHandle(mainObject.copyObject.name,{create:true});
        
                            var write = await file.createWritable();
                            await write.write(mainObject.copyObject.handle);
                            await write.close();
                        }
                    },
                });
            }else if(handle.kind == "file"){
                filesAndFolders.push({
                    handle:                                 handle,
                    folder:                                 folder,
                    name:                                     name,
                    type:                                   "file",
                    getName:function(){
                        return this.handle.name;
                    },
                    save:async function(options){
                        var newFile = await window.showSaveFilePicker(options);
                        var file = await this.handle.getFile();
                        var content = await file.arrayBuffer();

                        var write = await newFile.createWritable();
                        await write.write(content);
                        await write.close();
                    },
                    delete:function(type){
                        var textError =  "This "+this.type+" cannot be removed!";

                        type == 0 || type == undefined  ?  this.handle.remove() : 
                        type == 1     ?     this.folder.removeEntry(this.name,) :
                        console.error(textError);
                    },
                    write:async function(content){
                        var file = await this.handle;
            
                        var write = await file.createWritable();
                        await write.write(content);
                        await write.close();
                    },
                    read:async function(content){
                        return await this.handle.getFile();
                    },
                    copy:async function(){
                        var file = await this.handle.getFile();
                        var content = await file.arrayBuffer();

                        mainObject.copyObject = {
                            handle:                           await content,
                            folder:                                  "root",
                            name:                          this.handle.name,
                            type:                                    "file",
                        }
                    },
                    cut:async function(type){     
                        var cutFolder = this;                   
                        this.copy().then(function(result){
                            cutFolder.delete(type);
                        });
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
                    rename:async function(name,type){
                        if(type == 0 || type == undefined){
                            this.handle.move(name);
                        }else if(type == 1){
                            var movedFolder = this;                   
                            this.buffer().then(async function(result){
                                movedFolder.delete(1);
                                var mainFolder = await movedFolder.folder;
        
                                var file = await mainFolder.getFileHandle(name,{create:true});
            
                                var write = await file.createWritable();
                                await write.write(mainObject.bufferObject.handle);
                                await write.close();
                            });
                        }
                    },
                    buffer:async function(){
                        var file = await this.handle.getFile();
                        var content = await file.arrayBuffer();
        
                        mainObject.bufferObject = {
                            handle:                          await content,
                            folder:                                 "root",
                            name:                         this.handle.name,
                            type:                                   "file",
                        }
                    },
                });
            }
        }
        return filesAndFolders;
    }
}