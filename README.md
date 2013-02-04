# node-windows

  This is a standalone module, originally designed for internal use in [NGN](http://github.com/coreybutler/NGN). 
  However; it is capable of providing the same features for Node.JS scripts
  independently of NGN.

## Overview

The following features are available in node-windows:

- **elevate**: Run a command with elevated privileges (may prompt user for acceptance)
- **sudo**: Run an `exec` command as a sudoer.
- **isAdminUser**: Determines whether the current user has administrative privileges.
- **service**: A daemon utility. Supports creating Windows services and event logs.

## elevate

Elevate is similar to `sudo` on Linux/Mac. It attempts to elevate the privileges of the 
curernt user to a local administrator. Using this does not require a password, but it
does require that the current user have administrative privileges. Without these
privileges, the command will fail with a `access denied` error. 

On systems with UAC enabled, this may prompt the user for permission to proceed:

![UAC Prompt](http://upload.wikimedia.org/wikipedia/en/5/51/Windows_7_UAC.png)

**Syntax**:

`elevate(cmd[,options,callback])`

- _cmd_: The command to execute with elevated privileges. This can be any string that would be typed at the command line.
- _options_ (optional): Any options that will be passed to `require('child_process').exec(cmd,<OPTIONS>,callback)`.
- _callback_ (optional): The callback function passed to `require('child_process').exec(cmd,options,<CALLBACK>)`.

## sudo

Sudo acts similarly to `sudo` on Linux/Mac. Unlike _elevate_, it requires a password, but it 
will not prompt the user for permission to proceed. Like _elevate_, this 
_still requires administrative privileges_ for the user, otherwise the command will fail.
The primary difference between this and _elevate()_ is the prompt.

**Syntax**:

`sudo(cmd,password[,options,callback])`

- _cmd_: The command to execute with elevated privileges. This can be any string that would be typed at the command line.
- _password_: The password of the user 
- _options_ (optional): Any options that will be passed to `require('child_process').exec(cmd,<OPTIONS>,callback)`.
- _callback_ (optional): The callback function passed to `require('child_process').exec(cmd,options,<CALLBACK>)`.

## isAdminUser

This asynchronous command determines whether the current user has administrative privileges.
It passes a boolean value to the callback, returning `true` if the user is an administrator
or `false` if it is not.

**Example**

```js
var wincmd = require('node-windows');

wincmd.isAdminUser(function(isAdmin){
  if (isAdmin) {
    console.log('The user has administrative privileges.');
  } else {
    console.log('NOT AN ADMIN');
  }
});
```

## service

Service is a library for creating and managing Windows services from Node.JS scripts (i.e. daemons).

There are 2 attributes and 4 methods.

### Attributes

The `user` attribute is an object with three attributes: `domain`,`account`, and `password`. 
This can be used to identify which user the service library should use to perform system commands.
By default, the domain is set to the local system, but it can be overridden with an Active Directory
or LDAP domain. For example:

**app.js**
```js
var svc = require('node-windows').service;

svc.user.domain = 'mydomain.local';
svc.user.account = 'username';
svc.user.password = 'password';
...
```

Both the account and password must be explicitly defined if you want the service module to
run commands as a specific user. By default, it will run using the user account that launched
the process (i.e. who launched `node app.js`).

The other attribute is `sudo`. This attribute has a single property called `password`. By supplying
this, the service module will attempt to run commands using the user account that launched the
process and the password for that account. This should only be used for accounts with administrative
privileges.

**app.js**
```js
var svc = require('node-windows').service;

svc.sudo.password = 'password';
...
```

### Methods

The service library has 4 methods.
  
#### .start(name,filepath[,pidfile,callback])

This method will start a node process as a Windows service, which will be visible in the 
Services panel of Windows, i.e.

![Service Panel](http://www.techknowl.com/wp-content/uploads/2009/03/Windows-services-.jpg)

If the service does not already exist, it will be created. Creating a service requires administrative
privileges, as does removing. Starting/stopping require elevated privileges.

**app.js**
```js
var svc = require('node-windows').service;

svc.start('My App','C:\path\to\myapp.js',function(){
  console.log('Started');
});
```

Additionally, an event log called `My App` will be created as an Application Log.


#### stop(name,callback)

This method will stop a running service that was created with this library (or other nssm.exe 
processes).

#### restart(name[,file,pidfile])

This will restart a service that is currently running.

#### remove(name)

Deletes a service.

# Licenses

NSSM and sudowin are the copyrights of their respective owners. No license ships with NSSM,
but it can be found at [http://nssm.cc](http://nssm.cc). sudowin is a BSD license. 

All other scripts are Copyright (c) Corey Butler under an MIT license. 

(The MIT License)

Copyright (c) 2012 Corey Butler &lt;corey@coreybutler.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.