# FileAccess
Library that facilitates the manipulation of user files, it uses "File System Access API", polyfill coming soon...<br>
**minus 243 lines of code (479 - 236)**

## Folders

#### Open a folder

```
var appFiles = new FileAccess();
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
  console.log(folder.entries[i].getName());
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
folder.getName();
```
#### Get type of folder

```
folder.getType();
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
//folder.rename("newName"); && folder.rename("newName",0); works only in files
folder.rename("newName",1);
```
#### Move folder

```
//folder.move(/*folderObject*/); && folder.move(/*folderObject*/,0); works only in files
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

## Files

#### Open a file

```
var appFiles = new FileAccess();
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
file.getName();
```
#### Get type of file

```
file.getType();
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
file.save();
```
#### Download file

```
file.download("MyFile.txt");
```
#### Or do all this manually with the handler

```
file.handle;
folder.handle;//or
```
