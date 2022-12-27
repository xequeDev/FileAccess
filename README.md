# LocalFiles
Library that facilitates the manipulation of user files, it uses "File System Access API", polyfill coming soon...

## Folders

#### Open a folder

```
var appFiles = new LocalFiles();
var folder;

function getFolder(){
  appFiles.openFolder().then(function(result){
    folder = result;
  });
}
```
#### Access content of folder

```
for(var i in folder.entries){
  console.log(folder.entries[i].getName);
}
```
#### Get parent folder handle

```
folder.folder;
```
#### Get entries (subFolder/subFiles)

```
folder.entries;
```
#### Get name of folder

```
folder.name;
//or
folder.getName();
```
#### Get type of folder

```
folder.type;
```
#### Delete folder

```
folder.delete();
//or
folder.delete(1);
```
#### Cut folder

```
folder.cut();
//or
folder.cut(1);
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
//folder.rename("newName"); works only in files
folder.rename("newName",1);
```
#### Move folder

```
//folder.move(/*folder*/); works only in files
folder.move(/*folder*/,1);
```
#### Update folder entries

```
folder.update();
```
#### Create a folder/file in folder

```
folder.create("folder","folderName");
folder.create("file","fileName.txt","Text...");
```
#### Or do it manually with the handler

```
folder.handle;
```

## Files

#### Open a file

```
var appFiles = new LocalFiles();
var file;

function getFile(){
  appFiles.openFile().then(function(result){
    file = result;
  });
}
```
#### Get parent folder handle

```
file.folder;
```
#### Get name of file

```
file.name;
//or
file.getName();
```
#### Get type of file

```
file.type;
```
#### Edit content of file

```
file.write("Text in file");
```
#### Read content of file

```
file.read(/*blob or file or text or arrayBuffer*/"text").then(function(result){
  console.log(result);
});
```
#### Rename file

```
file.rename("MyFile.txt");
//or
file.rename("MyFile.txt",1);
```
#### Move file

```
file.move(/*folder*/);
//or
file.move(/*folder*/,1);
```
#### Copy file

```
file.copy();
```
#### Cut file

```
file.cut();
//or
file.cut(1);
```
#### Put file in buffer

```
file.buffer();
```
#### Save file

```
file.save();
```
#### Or do it manually with the handler

```
folder.handle;
```
