parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"rP21":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.bumpVersion=void 0;const e=require("json-bumper"),r=async(r,s)=>await e(r,s);exports.bumpVersion=r;
},{}],"QCba":[function(require,module,exports) {
"use strict";var e=require("actions-toolkit"),o=require("./helpers/bumper");e.Toolkit.run(async e=>{const s=process.env.VERSION_FILE_NAME||"package.json",i=process.env.VERSION_ENTRY||"version",r=process.env.GITHUB_USER||"GitHub Version Bumper",n=process.env.GITHUB_EMAIL||"github-version-bumper@users.noreply.github.com",a=process.env.GITHUB_WORKSPACE;console.log({githubWorkspace:a}),console.log({env:process.env});const t=JSON.parse(e.getFile(s)).version;console.log(`Version ${t}`);try{var c;await e.runInWorkspace("git",["config","--global","--add","safe.directory",`${a}`]),await e.runInWorkspace("git",["config","user.name",`"${r}"`]),await e.runInWorkspace("git",["config","user.email",`"${n}"`]);let t=!1;const p=null===(c=/refs\/[a-zA-Z]+\/(.*)/.exec(process.env.GITHUB_REF))||void 0===c?void 0:c[1];await e.runInWorkspace("git",["checkout",p]);const g=JSON.stringify(await e.runInWorkspace("git",["log","-1"])).toLowerCase()||"";if(console.log("lastcommitmessage",g),"master"===p)if(g.toLowerCase().includes("ci-ignore"))console.log("ci-ignore"),t=!0;else if(g.toLowerCase().includes("ci-version=")){const e=g.toLowerCase().split('ci-version=\\"')[1].split('\\"')[0];console.log("replace:",e),await(0,o.bumpVersion)(s,{replace:e,entry:i})}else if(g.toLowerCase().includes("ci-pre=")){console.log("pre");const e=g.toLowerCase().split('ci-pre=\\"')[1].split('\\"')[0];console.log("pre:",e),await(0,o.bumpVersion)(s,{pre:e,entry:i})}else g.toLowerCase().includes("ci-major")?(console.log("major"),await(0,o.bumpVersion)(s,{major:!0,entry:i})):g.toLowerCase().includes("ci-minor")?(console.log("minor"),await(0,o.bumpVersion)(s,{minor:!0,entry:i})):(console.log("patch"),await(0,o.bumpVersion)(s));else if("staging"===p||"qc"===p||"production"===p){console.log("current branch is:",p),console.log("entry:",i);const e=await(0,o.bumpVersion)(s);if(e.original.includes("rc")){let i=e.original.split("-rc.")[1];i++;const r=e.original.slice(0,-1)+i;await(0,o.bumpVersion)(s,{replace:r})}else{const i=e.original,r="-rc.0",n=i.concat(r);await(0,o.bumpVersion)(s,{replace:n})}}else if("alpha"===p){const e=await(0,o.bumpVersion)(s);if(e.original.includes("pr")){let i=e.original.split("-pr.")[1];i++;const r=e.original.slice(0,-1)+i;await(0,o.bumpVersion)(s,{replace:r})}else{const i=e.original,r="-pr.0",n=i.concat(r);await(0,o.bumpVersion)(s,{replace:n})}}if(!t){const o=JSON.parse(e.getFile(s)).version;console.log("-newVersion",o),await e.runInWorkspace("git",["commit","-a","-m",`ci: v${o}`]);const i=`https://${process.env.GITHUB_ACTOR}:${process.env.GITHUB_TOKEN}@github.com/${process.env.GITHUB_REPOSITORY}.git`;await e.runInWorkspace("git",["pull","--tags"]),await e.runInWorkspace("git",["tag",o]),await e.runInWorkspace("git",["push",i,"--follow-tags"]),await e.runInWorkspace("git",["push",i,"--tags"])}}catch(l){e.log.fatal(l),e.exit.failure("Failed to bump version")}e.exit.success("Version bumped!")});
},{"./helpers/bumper":"rP21"}]},{},["QCba"], null)