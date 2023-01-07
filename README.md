# FileAccess
Library that facilitates the manipulation of user files, it uses "File System Access API", polyfill in another future library...<br>
## Folders

#### Open a folder

```
var appFiles = new FileAccess();
var folder;

function getFolder(){
  appFiles.openFolder({
    id:"mainFolder",
    mode:"readwrite",
    init:"documents",
  }).then(function(result){
    folder = result;
  });
}
```
#### Access content of folder

```
for(var i in folder.entries){
  console.log(folder.entries[i].getName());
}
```
#### Get parent folder *Object*

```
folder.getParent();
```
#### Get path of folder

```
folder.getPath();
```
#### Get entries (subFolder/subFiles)

```
folder.entries;
```
#### Get name of folder

```
folder.getName();
```
#### Get type of folder

```
folder.getType();
```
#### Get size of folder

```
folder.getSize();
```
#### Delete folder

```
folder.delete();
folder.delete(0);//or
folder.delete(1);//or
```
#### Cut folder

```
folder.cut();
folder.cut(0);//or
folder.cut(1);//or
```
#### Copy folder

```
folder.copy();
```
#### Paste current copied folder/file

```
folder.paste();
```
#### Put folder in buffer

```
folder.buffer();
```
#### Place current buffered folder/file

```
folder.place();
```
#### Rename folder

```
//folder.rename("newName") & folder.rename("newName",0) works only in files
folder.rename("newName",1);
```
#### Move folder

```
//folder.move(/*folderObject*/) & folder.move(/*folderObject*/,0) works only in files
folder.move(/*folderObject*/,1);
```
#### Update folder entries

```
folder.update();
```
#### Create a folder/file in folder

```
folder.new("folder","folderName");
folder.new("file","fileName.txt",/*Blob*/);
```
#### Save folder in another folder

```
folder.save();
```
#### Download folder as zip

```
//need FileZip library
folder.download("folder.zip");
```

## Files

#### Open a file

```
var appFiles = new FileAccess();
var file;

function getFile(){
  appFiles.openFile({
    multiple:true,
    accept:[{
      description:"Images",
      accept:{
        "image/*":[".png",".gif",".jpeg",".jpg"],
      },
    }],
   }).then(function(result){
    file = result;
  });
}
```
#### Get parent folder *Object*

```
file.getParent();
```
#### Get path of file

```
file.getPath();
```
#### Get name of file

```
file.getName();
```
#### Get type of file

```
file.getType();
```
#### Get size of file

```
file.getSize();
```
#### Get extensions of file

```
file.getExtensions();
//"index.html" Return ["index","html"]
//"script.min.js" Return ["script","min","js"]
//"style.home.min.css" Return ["style","home","min","css"]
```
#### Edit content of file

```
file.write(/*Blob*/);
```
#### Read content of file

```
file.read().then(function(result){
  console.log(result);
});
```
#### Rename file

```
file.rename("newName.txt");
file.rename("newName.txt",0);//or
file.rename("newName.txt",1);//or
```
#### Move file

```
file.move(/*folderObject*/);
file.move(/*folderObject*/,0);//or
file.move(/*folderObject*/,1);//or
```
#### Copy file

```
file.copy();
```
#### Delete file

```
file.delete();
file.delete(0);//or
file.delete(1);//or
```
#### Cut file

```
file.cut();
file.cut(0);//or
file.cut(1);//or
```
#### Put file in buffer

```
file.buffer();
```
#### Save file

```
file.save({
  name:"image.png",
  accept:[{
    description:"Images",
    accept:{
      "image/*":[".png"],
    },
  }],
);
```
#### Download file

```
file.download("MyFile.txt");
```
## Or do all this manually with the handler

```
file.handle;
folder.handle;//or
```
