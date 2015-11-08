define("snew/app",["exports","module","snew/obj/class","snew/obj/helper","snew/controller/class","snew/controller/helper","snew/helper/class","snew/helper/helper","snew/helper/eventsystem","snew/helper/router","snew/util/helper","snew/util/runloop","snew/view/class","snew/view/helper","snew/template/class","snew/template/helper"],function(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p){"use strict";function q(a){return a&&a.__esModule?a:{"default":a}}var r=q(c),s=q(d),t=q(e),u=q(f),v=q(g),w=q(h),x=q(i),y=q(j),z=q(k),A=q(l),B=q(m),C=q(n),D=q(o),E=q(p),F=(0,r["default"])({Obj:r["default"],didInit:!1,init:function(a){this.didInit=!0,window.app||(window.app={}),console.log("Can I haz some snews?"),_.merge(F,a),this.executeInit()},search:function(a){return this.controllerHelper.search(a)},executeInit:function(){var a=["eventsystem","viewHelper"];for(var b in a)a.hasOwnProperty(b)&&F[a[b]].init();for(var c in this)_.isObject(this[c])&&_.isFunction(this[c].init)&&-1===a.indexOf(c)&&this[c].init()},transform:function G(a,b){var G="",c=!1;a=a.replace(b,"");for(var d in a)if(a.hasOwnProperty(d)){var e=a[d];if("/"==e)c=!0;else if(c){if("class"==a.substr(d,a.length-1)){G=G.capitalize();break}G+=e.toUpperCase(),c=!1}else G+=e}return G}});F.objHelper=s["default"],F.Controller=t["default"],F.controllerHelper=u["default"],F.Helper=v["default"],F.helperHelper=w["default"],F.eventsystem=x["default"],F.routerHelper=y["default"],F.utilHelper=z["default"],F.utilRunloop=A["default"],F.View=B["default"],F.viewHelper=C["default"],F.Template=D["default"],F.templateHelper=E["default"],setTimeout(function(){F.didInit||console.log("To setup a snew application you should call snew.init({})")},10),b.exports=F}),define("snew/controller/class",["exports","module"],function(a,b){"use strict";function c(a,b){snew.controllerHelper.list[a]?console.warn("The Controller for "+a+" already exists"):(snew.controllerHelper.list[a]=snew.Obj("controller",a,b),snew.controllerHelper.list[a]._meta.path=a,snew.utilHelper.merge(snew.controllerHelper.list[a],d))}var d={_meta:{registry:!0,contentSpace:"content",type:"controller",requests:{}},content:{},construct:function(){},notify:function(){},preprocess:function(a){return a},send:function(a){var b=snew.helperAdapter.send(a);return this._meta.requests[b]=a,b},fetch:function(){this._meta.modelFinished=!1,this._meta.modelLoading=!1,this._loadModel()},_loadModel:function(){if(this.model&&!this._meta.modelFinished){if(!this._meta.modelLoading){this._meta.modelLoading=!0;var a=this.model;this.send({model:a,success:"_modelSuccess",error:"_modelError"})}return!0}return!1},_checkRequest:function(a,b){for(var c in this._meta.requests)if(c==a){var d=this._meta.requests[c],e=d.success;b.error&&(e=d.error),this[e](b),delete this._meta.requests[c]}},subscribe:function(a){return snew.utilAdapter.subscribe(a)},_modelSuccess:function(a){this._meta.modelFinished=!0,a=this.preprocess(a.result),_.isArray(a)&&(this.meta.key="values",console.info(this._meta.path+" had an model which returned an array. Put it instead of content, to content.values")),this.model.key?this.set(this.model.key,a,this.model.opt):this.setAll(a,this.model.opt),snew.controllerHelper.callInits()},_modelError:function(a){this._meta.modelFinished=!0,this.set("error",!0),this.set("message",a.result),snew.controllerHelper.callInits(),console.warn(this._meta.path+" got an error ",a)}};b.exports=c}),define("snew/controller/helper",["exports","module","snew/obj/class"],function(a,b,c){"use strict";function d(a){return a&&a.__esModule?a:{"default":a}}var e=d(c);b.exports=(0,e["default"])({id:0,list:{},anons:{},inits:[],garbageCollection:!0,systemLoaded:!1,_registers:{},init:function(){this.garbageCollection!==!1&&this.addJob({callback:this.garbage}),this.addJob({callback:this._callInits})},create:function(a,b,c){var d=++this.id;this.inits.push(d),this.anons[d]=this.getEntity(a),this.anons[d]._meta.uid=d,b&&_.merge(this.anons[d].content,b),this.anons[d].view=snew.viewHelper.create(a,c),this.anons[d].view.controller=this.anons[d],this._handleRegisters(this.anons[d],c),snew.utilHelper.safeCall(this.anons[d],"construct"),snew.utilHelper.safeCall(this.anons[d].view,"construct");var e=this.anons[d].view._compileComplete();return{uid:d,html:e}},_callInits:function(a){for(var b=[],c=!1,d=0;d<snew.controllerHelper.inits.length;d++){var e=snew.controllerHelper.inits[d];c=!0,snew.controllerHelper.controllerExists(e)&&(snew.controllerHelper.anons[e]._loadModel(e)?b.push(e):(snew.utilHelper.safeCall(snew.controllerHelper.anons[e],"init"),snew.utilHelper.safeCall(snew.controllerHelper.anons[e].view,"init")))}c&&0===b.length&&!snew.controllerHelper.systemLoaded&&(snew.controllerHelper.systemLoaded=!0,snew.helperHelper.callInits()),snew.controllerHelper.inits=b},controllerExists:function(a){return snew.controllerHelper.anons[a]?!0:void console.error("Controller does not exist",a)},getEntity:function(a){return this.list[a]||(console.log("Controller "+a+" did not exist, I created it for you"),snew.Controller(a,{_meta:{pseudo:!0,path:a}})),_.cloneDeep(this.list[a])},search:function(a){return this._iterate(a)},call:function(a,b,c){return this._iterate(a,b,c)},_iterate:function(a,b,c){var d=window.parseInt(a,10);if(isNaN(d)||!this.anons[d]){var e=[];for(var f in this.anons)if(this.anons.hasOwnProperty(f)&&(this.anons[f]._meta.path==a||"@each"==a||"*"==a||this.anons[f]._meta.uid==a))if(b){var g=snew.utilHelper.safeCall(this.anons[f],b,c);e.push(g)}else e.push(this.anons[f]);return e}return b?[snew.utilHelper.safeCall(this.anons[d],b,c)]:[this.anons[d]]},_addRegister:function(a,b){this._registers[a]?console.warn(a+" has already an registration"):this._registers[a]=b},_handleRegisters:function(a){for(var b in this._registers){var c=this._registers[b];snew[b][c](a,"controller")}},garbage:function(){}})}),define("snew/helper/adapter",["exports","module","snew/obj/class"],function(a,b,c){"use strict";function d(a){return a&&a.__esModule?a:{"default":a}}var e=d(c);b.exports=(0,e["default"])({adapterImplementation:{protocol:"http",host:window.location.hostname,port:2901,path:"/api",getDomain:function(){var a=this.protocol+"://"+this.host;return this.port&&(a+=":"+this.port),a},buildUrl:function(a){return this.getDomain()+this.path+"/"+a.model.controller+"/"+a.model.action},sendRequest:function(a){var b=JSON.stringify(a.model.payload),c=$.ajax(this.buildUrl(a),{success:this.success,error:this.error,data:b,processData:!1,contentType:"application/json",type:"post"});c.requestId=a.requestId},success:function(a,b,c){var d=c.requestId;snew.helperAdapter.emit(d,{result:a})},error:function(a,b,c){var d=a.requestId;try{snew.helperAdapter.emit(d,{error:a.status,result:c})}catch(e){snew.helperAdapter.emit(d,{error:"500",result:"API response was not valid"})}}},states:{pending:0,sended:1,finished:2},id:0,requests:{},init:function(){this.addJob({callback:this.trigger})},send:function(a){return this.checkValidity(a),a.requestState=this.states.pending,a.requestId=++this.id,this.requests[this.id]=a,this.id},checkValidity:function(a){if(!a.model||!a.model.controller||!a.model.action)throw"Your given request is not valid"},trigger:function(){for(var a in snew.helperAdapter.requests)snew.helperAdapter.requests[a].requestState===snew.helperAdapter.states.pending&&(snew.helperAdapter.requests[a].requestState=snew.helperAdapter.states.sended,snew.helperAdapter.adapterImplementation.sendRequest(snew.helperAdapter.requests[a]))},emit:function(a,b){if(!this.requests[a])throw"There was no request with id "+a;this.requests[a].requestState=this.states.finished,snew.controllerHelper.call("*","_checkRequest",[a,b])}})}),define("snew/helper/class",["exports","module"],function(a,b){"use strict";function c(a,b){app.helper||(app.helper={}),app.helper[a]?console.warn("The helper for "+a+" already exists"):app.helper[a]=snew.Obj("helper",a,b)}b.exports=c}),define("snew/helper/eventsystem",["exports","module","snew/obj/class"],function(a,b,c){"use strict";function d(a){return a&&a.__esModule?a:{"default":a}}function e(a){if(Array.isArray(a)){for(var b=0,c=Array(a.length);b<a.length;b++)c[b]=a[b];return c}return Array.from(a)}var f=d(c);b.exports=(0,f["default"])({_list:{},_eventParts:["action","type"],init:function(){snew.controllerHelper._addRegister("eventsystem","_addEvents")},trigger:function(a,b,c){var d=[];if(this._list[a])for(var f in this._list[a])for(var g in this._list[a][f])for(var h=this._list[a][f][g],i=snew[f+"Helper"].search(g),j=0;j<i.length;j++)for(var k=i[j],l=0;l<h.length;l++){var m=h[l];k[m.action]?d.push(k[m.action].apply(k,[a].concat(e(c)))):console.error("The "+f+" does not have the function "+m.action,g)}return d.length||console.warn("There was no eventdefinition found "+a),d},_addEvents:function(a,b){if(a.events)for(var c=0;c<a.events.length;c++)this.addEvent(a.events[c],a._meta.uid,b)},addEvent:function(a,b,c){this._list[a.type]||(this._list[a.type]={}),this._list[a.type][c]||(this._list[a.type][c]={}),this._list[a.type][c][b]||(this._list[a.type][c][b]=[]),this._list[a.type][c][b].push(a)},validateEvent:function(a,b){var c=!0,d=0;for(var e in a)a.hasOwnProperty(e)&&(-1===this._eventParts.indexOf(e)?console.warn(b._meta.namespace+" | 	The event has some unknown options ("+e+")",a,b):(d++,"action"!==e||b[a[e]]||(c=!1,console.error(b._meta.namespace+" | 	The given action ("+a[e]+") does not exist in the class"))));return c&&d===this._eventParts.length?!0:!1}})}),define("snew/helper/helper",["exports","module","snew/obj/class"],function(a,b,c){"use strict";function d(a){return a&&a.__esModule?a:{"default":a}}var e=d(c);b.exports=(0,e["default"])({search:function(){var a=[];for(var b in app.helper)a.push(app.helper[b]);return a},callInits:function(){var a=[];for(var b in app.helper)snew.utilHelper.safeCall(app.helper[b],"init");return a}})}),define("snew/helper/router",["exports","module","snew/obj/class"],function(a,b,c){"use strict";function d(a){return a&&a.__esModule?a:{"default":a}}var e=d(c);b.exports=(0,e["default"])({events:[{action:"change",type:"hashchange"},{action:"changeUrl",type:"route"}],delimiter:"/",init:function(){this.changed||this.change(location.hash)},getState:function(){for(var a=location.hash.substring(1,location.hash.length),b=a.split(this.delimiter);b.length>0&&""===b[b.length-1];)b.pop();return b},changeUrl:function(a){var b=a.join(this.delimiter);return location.hash!="#"+b?(location.hash=b,!0):void 0},writeUrl:function(){location.hash=this.getUrl()},getUrl:function(a){return a.join(this.delimiter)},change:function(a){this.triggerUrl(this.getState())},triggerUrl:function(a){this.changed=!0;var b=null,c=this.getUrl(a);b=c.length?this.trigger("/"+c):this.trigger("/"),0===b.length&&this.trigger("/404")}})}),define("snew/obj/class",["exports","module","snew/util/helper"],function(a,b,c){"use strict";function d(a){return a&&a.__esModule?a:{"default":a}}var e=d(c),f={_meta:{contentSpace:!1},init:function(){},destroy:function(){},get:function(a,b){return this._handleData("get",a,null,b)},set:function(a,b,c){return this._handleData("set",a,b,c)},addJob:function(a){a.uid=this._meta.uid,snew.utilRunloop._addJob(a)},setAll:function(a,b){var c=this._meta.contentSpace;return b||(b={}),void 0!==b.contentSpace&&(c=b.contentSpace),b.contentSpace=!1,this._handleData("set",c,a,b)},push:function(a,b,c){return this._handleData("push",a,b,c)},pushOnce:function(a,b,c){return this._handleData("pushOnce",a,b,c)},pop:function(a,b,c){return this._handleData("pop",a,b,c)},trigger:function(a){for(var b=arguments.length,c=Array(b>1?b-1:0),d=1;b>d;d++)c[d-1]=arguments[d];return snew.eventsystem.trigger(a,"*",c)},_handleData:function(a,b,c,d){return d||(d={}),b=this._generateRealpath(b,d),this._handleRealData(a,b,c,d)},_checkForEvent:function(a,b,c){for(var d={found:!1,result:null},e=0;e<this.events.length;e++){var f=this.events[e];if(snew.viewHelper.checkEventMatch(f.type,a,b)){var g=null;if(!c.pseudo){var h=$(b.target).parents(f.selector);if($(b.target).is(f.selector))g=$(b.target);else{if(!h.length)continue;g=h}}var i=snew.viewHelper.getAttributes(g);this.controller&&_.isFunction(this.controller[f.action])&&(d.found=!0,c.pseudo?d.result=this.controller[f.action](b):(d.result=this.controller[f.action](i,b,g),d.result===!1&&(b.propagation=!1))),_.isFunction(this[f.action])&&(d.found=!0,c.pseudo?d.result=this[f.action](b):(d.result=this[f.action](i,b,g),d.result===!1&&(b.propagation=!1))),d.found||console.error("Found an eventdefinition "+a+" but the corresponding action "+f.action+" was not found")}}return d},_handleRealData:function(a,b,c,d,e){for(var f=b.split("."),g=_.clone(f),h=snew.objHelper.isQuery(b)?[]:void 0,i=0;i<f.length;i++){var j=f[i],k=g.slice(0,i),l=k[k.length-1];if(snew.objHelper.isQuery(j)){var m=this._getReference(k)[l];for(var n in m)m.hasOwnProperty(n)&&snew.objHelper.isTrue(m[n],j,d.query)&&(g[i]=n,h.push(this._handleRealData(a,g.join("."),c,d)));return h}if(i+1==f.length)return this._handleTypes(a,f,c,d)}return h},_handleTypes:function(a,b,c,d){var e=d.forceRender||!1,f=!1;switch(a){case"get":f=_.cloneDeep(this._getReference(b)[b[b.length-1]]);break;case"set":var g=this._getReference(b)[b[b.length-1]];g!=c&&(this._getReference(b)[b[b.length-1]]=c,f=!0,e=!0);break;case"push":case"pushOnce":var g=this._getReference(b,"arr")[b[b.length-1]];("pushOnce"!=a||-1===g.indexOf(c))&&(g.push(c),f=!0,e=!0);break;default:throw"type "+a+" is not defined"}if(e&&this.view){var h=!1,i=null;if(this._meta.contentSpace){var j=this._meta.contentSpace.split("."),k=j.length,l=b.slice(0,k);i=b.slice(k,b.length).join("."),_.isEqual(l,j)&&(h=!0)}else i=b.join("."),h=!0;h&&(snew.viewHelper.dirtyHandling!==!1?this.view._addDirty(i,a,c):this.view._render())}return f},_getReference:function(a,b){var c=null,d=null;1===a.length?(c=this,d=0):(c=this[a[0]],d=1);for(var e=d;e<a.length;e++){var f=a[e];if(c[f]||("arr"==b&&e<a.length?c[f]=[]:("obj"==b||e+1<a.length)&&(c[f]={})),e+1<a.length?(c=c[f],console.info(a.slice(0,e+1).join(".")+" did not exist, so I created it for you")):e!==a.length-1&&(c=c[f]),e==a.length-1)return 1===a.length?this:c}throw"Something went totally wrong at getting the references"},_generateRealpath:function(a,b){return b.contentSpace===!1||this._meta.contentSpace===!1?a:b.contentSpace?b.contentSpace+"."+a:this._meta.contentSpace?this._meta.contentSpace+"."+a:a}},g=function(){var a=arguments[arguments.length-1],b=_.cloneDeep(f);return e["default"].merge(a,b),arguments.length>1&&(a._meta.type=arguments[0]),arguments.length>2&&(a._meta.path=arguments[1]),a};b.exports=g}),define("snew/obj/helper",["exports","module","snew/obj/class"],function(a,b,c){"use strict";function d(a){return a&&a.__esModule?a:{"default":a}}var e=d(c);b.exports=(0,e["default"])({logicOperators:[{delimiter:"&&",defaultValue:!0},{delimiter:"||",defaultValue:!1},{delimiter:"@each",defaultValue:!0,skip:!0}],types:["==","!=",">=","<=",">","<"],isTrue:function(a,b,c){var d=this.getType(b),e=d.defaultValue;if(d.skip)return e;for(var f=b.split(d.delimiter),g=0;g<f.length;g++){var h=this.getLogicParts(f[g]);if(this.objCheck(a,h,c)!=d.defaultValue){e=!e;break}}return e},getVariableName:function(a){return"{"==a[0]&&"}"==a[a.length-1]?a.slice(1,a.length-1):void 0},objCheck:function(a,b,c){var d=null,e=this.getVariableName(b.value),f=[b.value];e&&(this.variableValidation(e,c),f=c[e]);for(var g=0;g<f.length;g++){var h=f[g];if(d=this.valueCompare(a[b.key],h,b.type))break}return d},valueCompare:function(a,b,c){var d=null;switch(c){case"==":d=a===b?!0:!1;break;case"!=":d=a!==b?!0:!1;break;case">=":d=a>=b?!0:!1;break;case"<=":d=b>=a?!0:!1;break;case">":d=a>b?!0:!1;break;case"<":d=b>a?!0:!1;break;default:throw"Type "+c+" is not implemented, please contact https://github.com/plusgut/snew/issues"}return d},getLogicParts:function(a){for(var b=0;b<this.types.length;b++){var c=this.types[b];if(-1!=a.indexOf(c)){var d=a.split(c);if(2!=d.length)throw"Your logic operator was there mutliple times "+a;return{key:d[0],type:c,value:d[1]}}}throw"Your logic operator was not available "+a},getType:function(a){for(var b=null,c=this.logicOperators.length;c>0;c--){var d=this.logicOperators[c-1];if(-1!=a.indexOf(d.delimiter)||1===c&&!b){if(b)throw"You can not use multiple types";b=d}}return b},isQuery:function(a){return-1!==a.indexOf("=")||-1!==a.indexOf("@")?!0:void 0},variableValidation:function(a,b){if(!b||void 0===b[a])throw a+" was not set in opt: {query: {}}";if(!_.isArray(b[a]))throw a+" query has to be an array"},isKeyChild:function(a,b){return!0}})}),define("snew/template/class",["exports","module"],function(a,b){"use strict";function c(a,b){snew.templateHelper.list[a]?console.warn("The Template for "+a+" already exists"):snew.templateHelper.list[a]=b}b.exports=c}),define("snew/template/helper",["exports","module","snew/obj/class"],function(a,b,c){"use strict";function d(a){return a&&a.__esModule?a:{"default":a}}var e=d(c);b.exports=(0,e["default"])({list:{},compile:function(a,b,c,d,e,f){if(this.list[a])return tempartCompiler.compile(this.list[a],c,d,e,a,f);throw"Template "+a+" does not exist"},getDependency:function(a,b,c){for(var d=this.list[a],e=b.split("-"),f=null,g=0;g<e.length;g++)for(var h=0;h<d.length;h++)if(d[h].id==e[g]){g+1<e.length?d=d[e[g]].contains:f=d[h];break}if("bindAttr"!==f.type)throw"Something went wrong here!";for(var i=0;i<f.order.length;i++)if(f.order[i]==c)return f.contains[i];console.error(" Couldnt update your value, seems like no one cares")}})}),define("snew/util/helper",["exports","module"],function(a,b){"use strict";String.prototype.capitalize=function(){return this[0].toUpperCase()+this.slice(1,this.length)};var c={merge:function(a,b){for(var c in b)b.hasOwnProperty(c)&&(a[c]?_.isObject(a[c])&&_.isObject(b[c])&&!_.isFunction(a[c])&&!_.isFunction(b[c])&&this.merge(a[c],b[c]):a[c]=b[c])},insertAt:function(a,b,c){return a.substr(0,b)+c+a.substr(b)},safeCall:function(a,b,c){if(c||(c=[]),app.debug)return a[b](c[0],c[1],c[2],c[3]);try{return a[b](c[0],c[1],c[2],c[3])}catch(d){console.error(d)}},transformNamespace:function(a){return a}};b.exports=window.snew?snew.Obj(c):c}),define("snew/util/runloop",["exports","module","snew/obj/class"],function(a,b,c){"use strict";function d(a){return a&&a.__esModule?a:{"default":a}}var e=d(c);b.exports=(0,e["default"])({jobs:[],ticks:10,init:function(){this.loop()},loop:function(){for(var a=0;a<this.jobs.length;a++)this.jobs[a].callback();setTimeout(this.loop.bind(this),this.ticks)},_addJob:function(a){return this.jobs.push(a)}})}),define("snew/view/class",["exports","module"],function(a,b){"use strict";function c(a,b){snew.viewHelper.list[a]?console.warn("The View for "+a+" already exists"):(snew.viewHelper.list[a]=snew.Obj("view",a,b),snew.utilHelper.merge(snew.viewHelper.list[a],d))}var d={_meta:{type:"view",contentSpace:"controller.content",currentValues:{},dirty:{}},events:[],construct:function(){},notify:function(){},_triggerEvent:function(a,b,c,d){},_updateCurrent:function(a,b,c){for(var d=snew.templateHelper.getDependency(this._meta.path,a,b),e=(this._searchBlock(a,d.id,c),0);e<d.depending.length;e++)this.controller.set(d.depending[e],c)},_searchBlock:function(a,b,c){for(var d=a.split("-"),e=this._meta.currentValues,f=0;f<d.length;f++)e=e[d[f]],e[b]=c},_render:function(){this._compile(this._meta.dirty),this._meta.dirty={},snew.utilHelper.safeCall(this.controller,"notify"),snew.utilHelper.safeCall(this,"notify")},_compile:function(a){return snew.templateHelper.compile(this.controller._meta.path,this.controller._meta.uid,this.controller.content,this._meta.currentValues,a,this.controller._meta.uid)},_compileComplete:function(){var a=this.controller._meta.uid;return snew.viewHelper.scriptStart(a,this._meta.path)+this._compile("*")+snew.viewHelper.scriptEnd(a)},_addDirty:function(a,b,c){this._meta.dirty[a]&&"set"!==b||(this._meta.dirty[a]=[]),this._meta.dirty[a].push({type:b,value:c}),snew.viewHelper.pushOnce("dirties",this.controller._meta.uid)},_handleDirties:function(){this._compile(this._meta.dirty),this._meta.dirty={}},obj:function(a){var b=null,c=this.controller._meta.uid,d=snew.viewHelper.uidDomNode+"["+snew.viewHelper.uidAttrStart+"="+c+"]",e=snew.viewHelper.uidDomNode+"["+snew.viewHelper.uidAttrEnd+"="+c+"]",f=$(d).nextUntil(e);if("root"!==a){if(!this[a])throw"Couldnt get you the obj because of missing definition";return b=this[a],$.merge(f.filter(b),f.children(b))}return f}};b.exports=c}),define("snew/view/helper",["exports","module","snew/obj/class"],function(a,b,c){"use strict";function d(a){return a&&a.__esModule?a:{"default":a}}var e=d(c);b.exports=(0,e["default"])({templatePrefix:"templates/",entrance:"#app",startPath:"main/app",uidDomNode:"script",uidAttrStart:"data-begin",uidAttrEnd:"data-end",list:{},dirties:[],eventSpaces:["controllerHelper","helperHelper"],eventString:"click submit change mouseover mouseout mousemove mouseup mousedown keyup keydown drag dragstart dragover mousewheel",eventMap:{keyup:{keyCode:{13:"view.enterkey",27:"view.escapekey"}}},_meta:{contentSpace:!1},init:function(){tempartCompiler.partial=this.partialHandling,this.dirtyHandling!==!1&&this.addJob({callback:this.dirtyChecking}),this.checkValidity(),this.insertApp(),this.addEvents()},partialHandling:function(a,b,c,d,e){return c[a.id]={path:e,uid:1+snew.controllerHelper.id},snew.controllerHelper.create(e,b).html},create:function(a,b){return this.getEntity(a)},insertApp:function(){var a=snew.controllerHelper.create(this.startPath,null,{}),b=$(this.entrance);1===b.length?$(this.entrance).replaceWith(a.html):console.error("snew.viewHelper.entrance was not represented in dom properly",b)},getEntity:function(a){return this.list[a]||(console.log("View "+a+" does not exist"),snew.View(a,{_meta:{pseudo:!0}})),_.cloneDeep(this.list[a])},scriptStart:function(a,b){return"<"+this.uidDomNode+" "+this.uidAttrStart+'="'+a+'" data-template="'+b+'"></'+this.uidDomNode+">"},scriptEnd:function(a){return"<"+this.uidDomNode+" "+this.uidAttrEnd+'="'+a+'"></'+this.uidDomNode+">"},checkValidity:function(){if(!this.entrance)throw"App entrance is not defined"},dirtyChecking:function(){if(snew.viewHelper.dirties){for(var a=0;a<snew.viewHelper.dirties.length;a++)for(var b=snew.viewHelper.dirties[a],c=snew.controllerHelper.search(b),d=0;d<c.length;d++){var e=c[d];e.view._handleDirties()}snew.viewHelper.dirties=[]}},getUids:function(a){for(var b=[],c=[];a.length>0;){for(var d=a.prev();d.length>0;){var e=this.isUidEndObj(d),f=this.isUidObj(d);e?c.push(e):f&&-1===c.indexOf(f)&&b.push(f),d=d.prev()}a=a.parent()}return b},isUidObj:function(a){return a.is(this.uidDomNode+"["+this.uidAttrStart+"]")?a.attr(this.uidAttrStart):void 0},isUidEndObj:function(a){return a.is(this.uidDomNode+"["+this.uidAttrEnd+"]")?a.attr(this.uidAttrEnd):void 0},addEvents:function(){$("body").on(this.eventString,function(a){return snew.viewHelper.handleEvent(a)}),$(window).on("hashchange",function(){trhis.trigger("hashchange",location.hash)})},handleEvent:function(a){var b=this.getUids($(a.target));return this.triggerExtra(a),this.updateData(a),this.triggerEvent(a.type,a,{controllers:b,pseudo:!1})},updateData:function(a){if("keyup"==a.type||"keydown"==a.type){var b=a.target.getAttribute("tempartstart");if(b&&13!==a.keyCode){var c=b.indexOf("-"),d=b.slice(0,c),e=b.slice(c+1,b.length),f=snew.search(d);if(1!==f.length)throw"Getting the correct controller failed somehow";var g=f[0];g.view._updateCurrent(e,"value",a.target.value)}}},triggerEvent:function(a,b,c){if(b||(b={}),-1!=a.search(":"))throw"events are not allowed to have a : inside";c=this.prepareEventOpt(c);for(var d=[],e=0;e<c.controllers.length;e++){for(var f=c.controllers[e],g=0;g<this.eventSpaces.length;g++){for(var h=snew[this.eventSpaces[g]].search(f),i=0;i<h.length;i++){var j=null;if(j=h[i].view?h[i].view._checkForEvent(a,b,c):h[i]._checkForEvent(a,b,c),j.found&&d.push(j.result),!c.pseudo&&b.propagation===!1)break}if(!c.pseudo&&b.propagation===!1)break}if(!c.pseudo&&b.propagation===!1)break}return d.length||!c.pseudo&&(c.pseudo||"click"!=b.type)||console.warn("There was no eventdefinition found "+a),d},triggerExtra:function(a){if(this.eventMap[a.type])for(var b in this.eventMap[a.type]){var c=a[b];if(c){var d=this.eventMap[a.type][b][c];d&&this.trigger(d,_.clone(a))}}},checkEventMatch:function(a,b,c){var d=":";if(a==b)return!0;for(var e=a.search(d),f={};-1!=e;){var g=a.substring(e+1,a.length),h=b.substring(e,b.length),i=g.search(/\W/),j=h.search(/\W/);-1===i&&(i=g.length),-1===j&&(j=h.length);var k=g.substring(0,i),l=h.substring(0,j),m=new RegExp(":"+k);a=a.replace(m,l),e=a.search(d),f[k]=l}if(a===b){for(var n in f)c[n]=f[n];return!0}},getAttributes:function(a,b){if(b||(b={}),a){var c=a[0].attributes;void 0===b.id&&a.attr("id")&&void 0===c["data-id"]&&(b.id=a.attr("id"));var d=["ember-extension"];for(var e in c)if(c.hasOwnProperty(e)){var f=c[e].name,g=c[e].value;if(f&&0===f.search("data-")){var h=f.replace(/data-/,"");void 0===b[h]&&-1==d.indexOf(h)&&(b[h]=g||null)}}var i=a.parent();i.length>0&&(b=this.getAttributes(i,b))}return b},prepareEventOpt:function(a){return a||(a={}),a.pseudo!==!1&&(a.pseudo=!0),a.controllers||(a.controllers=["*"]),a}})});