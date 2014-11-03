!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.wixmedia=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
function AdjustMixin(t){if(this.adjustments={},void 0!==t)for(var i in t)t.hasOwnProperty(i)&&(this.adjustments[i]=t[i])}function FilterMixin(t){if(this.filters={},void 0!==t)for(var i in t)t.hasOwnProperty(i)&&(this.filters[i]=t[i])}function OperationMixin(t,i,e,n,o,r,s){if(this.endpoint=t,this.imageId=i,this.version=e,this.opName=n,AdjustMixin.call(this,s),FilterMixin.call(this,r),this.operations={},void 0!==o)for(var p in o)o.hasOwnProperty(p)&&(this.operations[p]=o[p])}function outputParams(t){var i="";for(var e in t)t.hasOwnProperty(e)&&(i.length>0&&(i+=","),i+=null!==t[e]?e+"_"+t[e]:e);return i}function WidthHeightQualityMixin(){}function ResizeFillMixin(){}function AlignmentMixin(){}function Canvas(t,i,e,n,o,r){OperationMixin.call(this,t,i,e,"canvas",n,o,r)}function Fill(t,i,e,n,o,r){OperationMixin.call(this,t,i,e,"fill",n,o,r)}function Fit(t,i,e,n,o,r){OperationMixin.call(this,t,i,e,"fit",n,o,r)}function Crop(t,i,e,n,o,r){OperationMixin.call(this,t,i,e,"crop",n,o,r)}function fromUrl(t){var i=parser.parse(t),e=null,n=null,o=null;return i.api&&(i.api.hasOwnProperty("fit")?e=new Fit(i.endpoint,i.imageId,i.version,i.api.fit,i.api.filter,i.api.adjust).name(i.imageName):i.api.hasOwnProperty("canvas")?e=new Canvas(i.endpoint,i.imageId,i.version,i.api.canvas,i.api.filter,i.api.adjust).name(i.imageName):i.api.hasOwnProperty("fill")?e=new Fill(i.endpoint,i.imageId,i.version,i.api.fill,i.api.filter,i.api.adjust).name(i.imageName):i.api.hasOwnProperty("crop")&&(e=new Crop(i.endpoint,i.imageId,i.version,i.api.crop,i.api.filter,i.api.adjust).name(i.imageName)),null===e)?null!==n?n:o:e}function WixImage(t,i,e,n){this.imageId=i,this.endpoint=t,this.name=e,this.version=n||"v1"}function Defaults(){this.Alignment={CENTER:"c",TOP:"t",TOP_LEFT:"tl",TOP_RIGHT:"tr",BOTTOM:"b",BOTTOM_LEFT:"bl",BOTTOM_RIGHT:"br",LEFT:"l",RIGHT:"r",FACE_RECOGNITION:"f",ALL_FACES:"fs"},this.ResizeFilters={POINT:1,BOX:2,TRIANGLE:3,HERMITE:4,HANNING:5,HAMMING:6,BLACKMAN:7,GAUSSIAN:8,QUADRATIC:9,CUBIC:10,CATROM:11,MITCHELL:12,JINC:13,SINC:14,SINC_FAST:15,KAISER:16,WELCH:17,PARZEN:18,BOHMAN:19,BARTLETT:20,LAGRANGE:21,LANCZOS:22,LANCZOS_SHARP:23,LANCZOS2:24,LANCZOS2_SHARP:25,ROBIDOUX:26,ROBIDOUX_SHARP:27,COSINE:28},this.Anchor=this.Alignment,this.QUALITY=DEFAULT_QUALITY,this.US_RADIUS=DEFAULT_US_RADIUS,this.US_AMOUNT=DEFAULT_US_AMOUNT,this.US_THRESHOLD=DEFAULT_US_THRESHOLD,this.AUTO=DEFAULT_AUTO}var extend=_dereq_("./utils").extend,parser=_dereq_("./parser"),DEFAULT_QUALITY=75,DEFAULT_US_RADIUS=.5,DEFAULT_US_THRESHOLD=0,DEFAULT_US_AMOUNT=.2,DEFAULT_AUTO="auto";AdjustMixin.prototype={brightness:function(t){return this.adjustments.br=t||DEFAULT_AUTO,this},contrast:function(t){return this.adjustments.con=t||DEFAULT_AUTO,this},saturation:function(t){return this.adjustments.sat=t||DEFAULT_AUTO,this},hue:function(t){return this.adjustments.hue=t||DEFAULT_AUTO,this},hasAdjustments:function(){for(var t in this.adjustments)if(this.adjustments.hasOwnProperty(t))return!0;return!1}},AdjustMixin.prototype.br=AdjustMixin.prototype.brightness,AdjustMixin.prototype.con=AdjustMixin.prototype.contrast,AdjustMixin.prototype.sat=AdjustMixin.prototype.saturation,AdjustMixin.prototype.vib=AdjustMixin.prototype.vibrance,FilterMixin.prototype={oil:function(t){return void 0!==t&&t===!1?delete this.filters.oil:this.filters.oil=null,this},negative:function(t){return void 0!==t&&t===!1?delete this.filters.neg:this.filters.neg=null,this},pixelate:function(t){return this.filters.pix=t,this},blur:function(t){return this.filters.blur=t,this},unsharpMask:function(t,i,e){return this.filters.us=void 0!==i||void 0!==e||void 0!==t&&t!==DEFAULT_AUTO?t+"_"+i+"_"+e:DEFAULT_AUTO,this},sharpen:function(t){return this.filters.shrp=t,this},hasFilters:function(){for(var t in this.filters)if(this.filters.hasOwnProperty(t))return!0;return!1}},FilterMixin.prototype.pix=FilterMixin.prototype.pixelate,FilterMixin.prototype.neg=FilterMixin.prototype.negative,FilterMixin.prototype.pixfs=FilterMixin.prototype.pixelateFaces,FilterMixin.prototype.us=FilterMixin.prototype.unsharpMask,extend(OperationMixin.prototype,AdjustMixin.prototype),extend(OperationMixin.prototype,FilterMixin.prototype),OperationMixin.prototype.name=function(t){return this.imageName=t,this},OperationMixin.prototype.toUrl=function(){var t=this.endpoint+"/"+this.imageId+"/"+this.version+"/"+this.opName+"/",i=outputParams(this.operations);return this.hasAdjustments()&&(i.length>0&&(i+=","),i+=outputParams(this.adjustments)),this.hasFilters()&&(i.length>0&&(i+=","),i+=outputParams(this.filters)),t+i+"/"+this.imageName},WidthHeightQualityMixin.prototype={width:function(t){return this.operations.w=t,this},height:function(t){return this.operations.h=t,this},size:function(t,i,e){return this.width(t),this.height(i),void 0!==e&&this.quality(e),this},quality:function(t){return this.operations.q=t||75,this},baseline:function(t){return void 0!==t&&t===!1?delete this.operations.bl:this.operations.bl=null,this}},WidthHeightQualityMixin.prototype.w=WidthHeightQualityMixin.prototype.width,WidthHeightQualityMixin.prototype.h=WidthHeightQualityMixin.prototype.height,WidthHeightQualityMixin.prototype.q=WidthHeightQualityMixin.prototype.quality,WidthHeightQualityMixin.prototype.bl=WidthHeightQualityMixin.prototype.baseline,ResizeFillMixin.prototype.resizeFill=function(t){return this.operations.rf=t,this},ResizeFillMixin.prototype.rf=ResizeFillMixin.prototype.resizeFill,AlignmentMixin.prototype={alignment:function(t){return this.operations.al=t,this}},AlignmentMixin.prototype.al=AlignmentMixin.prototype.alignment,extend(Canvas.prototype,OperationMixin.prototype),extend(Canvas.prototype,WidthHeightQualityMixin.prototype),extend(Canvas.prototype,AlignmentMixin.prototype),Canvas.prototype.c=function(t){return this.operations.c=t,this},extend(Fill.prototype,OperationMixin.prototype),extend(Fill.prototype,WidthHeightQualityMixin.prototype),extend(Fill.prototype,AlignmentMixin.prototype),extend(Fill.prototype,ResizeFillMixin.prototype),extend(Fit.prototype,OperationMixin.prototype),extend(Fit.prototype,WidthHeightQualityMixin.prototype),extend(Fit.prototype,ResizeFillMixin.prototype),extend(Crop.prototype,OperationMixin.prototype),extend(Crop.prototype,WidthHeightQualityMixin.prototype),Crop.prototype.x=function(t){return this.operations.x=t,this},Crop.prototype.y=function(t){return this.operations.y=t,this},Crop.prototype.coords=function(t,i){return this.x(t),this.y(i),this},WixImage.prototype={canvas:function(t,i,e){return new Canvas(this.endpoint,this.imageId,this.version,t,i,e).name(this.name)},fill:function(t,i,e){return new Fill(this.endpoint,this.imageId,this.version,t,i,e).name(this.name)},fit:function(t,i,e){return new Fit(this.endpoint,this.imageId,this.version,t,i,e).name(this.name)},crop:function(t,i,e){return new Crop(this.endpoint,this.imageId,this.version,t,i,e).name(this.name)}},module.exports={WixImage:WixImage,Defaults:new Defaults,fromUrl:fromUrl};
},{"./parser":2,"./utils":3}],2:[function(_dereq_,module,exports){
function ImageURLTokenizer(t){this.buffer=t.toLowerCase(),this.offset=0,this.len=this.buffer.length,this.states={INITIAL:1,AFTER_KEYWORD:2,BEFORE_PARAM:3,BEFORE_VALUE:4},this.state=this.states.initial}function ImageURLParser(){this.table={},this.table.fit=fitMap,this.table.canvas=canvasMap,this.table.fill=fillMap,this.table.crop=cropMap}var extend=_dereq_("./utils").extend,adjustMap={br:{auto:!0,params:1,adjust:!0},con:{auto:!0,params:1,adjust:!0},sat:{auto:!0,params:1,adjust:!0},hue:{auto:!0,params:1,adjust:!0},auto_adj:{standalone:!0,params:0,adjust:!0}},filterMap={oil:{standalone:!0,params:0,filter:!0},neg:{standalone:!0,params:0,filter:!0},pix:{params:1,filter:!0},blur:{params:1,filter:!0},shrp:{params:1,filter:!0},usm:{auto:!0,params:3,filter:!0}},al={auto:!0,params:1},rf={params:1},whq={w:{params:1},h:{params:1},q:{params:1,auto:!0},bl:{standalone:!0}},canvasMap={al:al,c:{params:1}};extend(canvasMap,whq),extend(canvasMap,filterMap),extend(canvasMap,adjustMap);var fillMap={rf:rf,al:al};extend(fillMap,whq),extend(fillMap,filterMap),extend(fillMap,adjustMap);var fitMap={rf:rf};extend(fitMap,whq),extend(fitMap,filterMap),extend(fitMap,adjustMap);var cropMap={x:{params:1},y:{params:1}};extend(cropMap,whq),extend(cropMap,filterMap),extend(cropMap,adjustMap);var keywords={crop:!0,fit:!0,fill:!0,canvas:!0},tokenTypes={UNDERSCORE:1,KEYWORD:2,VALUE:3,AUTO_VALUE:4,EOF:5,PARAM:6};ImageURLTokenizer.prototype.isLetter=function(t){return t>=65&&90>=t||t>=97&&122>=t},ImageURLTokenizer.prototype.isNumber=function(t){return 46===t||t>=48&&57>=t},ImageURLTokenizer.prototype.nextToken=function(){for(;this.offset<this.len;){var t=this.buffer.charCodeAt(this.offset),e=this.offset;if(44!==t)if(47!==t||this.state!==this.states.AFTER_KEYWORD){if(32===t)switch(this.state){case this.states.AFTER_KEYWORD:case this.states.BEFORE_PARAM:this.offset++;continue}if(this.isLetter(t)){this.offset++;do{if(t=this.buffer.charCodeAt(this.offset),!this.isLetter(t))break;this.offset++}while(this.offset<this.len);var s=this.buffer.slice(e,this.offset);if(keywords[s])return this.state=this.states.AFTER_KEYWORD,{start:e,end:this.offset,type:tokenTypes.KEYWORD,keyword:s};if((this.state===this.states.AFTER_KEYWORD||this.state===this.states.VALUE)&&"auto"===s)return{start:e,end:this.offset,type:tokenTypes.AUTO_VALUE};if(!(this.state!==this.states.AFTER_KEYWORD&&this.state!==this.states.BEFORE_PARAM||95!==t&&44!==t&&47!==t))return{start:e,end:this.offset,type:tokenTypes.PARAM,text:s};if(this.state===this.states.BEFORE_VALUE)return{start:e,end:this.offset,type:tokenTypes.VALUE,value:s}}else{if(95===t){var a={start:e,end:this.offset,type:tokenTypes.UNDERSCORE};return this.state=this.states.BEFORE_VALUE,this.offset++,a}if(this.state===this.states.BEFORE_VALUE&&(this.isNumber(t)||45===t)){this.offset++;do{if(t=this.buffer.charCodeAt(this.offset),!this.isNumber(t))break;this.offset++}while(this.offset<this.len);return{start:e,end:this.offset,type:tokenTypes.VALUE,value:this.buffer.slice(e,this.offset)}}this.state=this.states.INITIAL,this.offset++}}else this.offset++;else this.offset++,this.state=this.states.BEFORE_PARAM}return{type:tokenTypes.EOF}},ImageURLParser.prototype.parse=function(t){var e,s,a,i,r,o,f,n,p,h,l=new ImageURLTokenizer(t),u={},d=-1,E=-1,R=!0;u.filter={},u.adjust={};do switch(e=l.nextToken(),e.type){case tokenTypes.EOF:R=!1;break;case tokenTypes.KEYWORD:if(-1===d&&(d=e.start),a=this.table[e.keyword],void 0===a)throw"Bad Image operation found: "+e.keyword;u[e.keyword]={},s=e.keyword;break;case tokenTypes.PARAM:if(null===a||void 0===a[e.text])throw"unknown parameter: "+e.text;if(r=a[e.text],void 0===r)throw"unknown parameter: "+e.text;if(r.standalone){u[s][e.text]=null;break}i=e.text,o=r.params,n=r.auto,p=r.filter,h=r.adjust,f=[];break;case tokenTypes.VALUE:o--,f.push(e.value),0===o&&(p?u.filter[i]=f.join("_"):h?u.adjust[i]=f.join("_"):u[s][i]=f.join("_")),E=e.end;break;case tokenTypes.AUTO_VALUE:if(!n)throw"auto not allowed for parameter: "+i;u[s][i]=e.value,E=e.end}while(R);var m=t.substring(0,d-1).split("/"),A=m.pop(),c=m.pop(),M=m.join("/");return{imageId:c,version:A,imageName:t.substring(E+1),endpoint:M,api:u}};var parser=new ImageURLParser;module.exports.parse=function(t){return parser.parse(t)};
},{"./utils":3}],3:[function(_dereq_,module,exports){
module.exports.extend=function(r,e){for(var n in e)e.hasOwnProperty(n)&&(r[n]=e[n]);return r};
},{}],4:[function(_dereq_,module,exports){
var Images=_dereq_("./images.js");module.exports={fromUrl:Images.fromUrl,WixImage:function(e,a,m){return new Images.WixImage(e,a,m)},Defaults:Images.Defaults};
},{"./images.js":1}]},{},[4])
(4)
});