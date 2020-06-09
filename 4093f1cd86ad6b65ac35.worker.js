!function(t){var e={};function r(n){if(e[n])return e[n].exports;var a=e[n]={i:n,l:!1,exports:{}};return t[n].call(a.exports,a,a.exports,r),a.l=!0,a.exports}r.m=t,r.c=e,r.d=function(t,e,n){r.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},r.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},r.t=function(t,e){if(1&e&&(t=r(t)),8&e)return t;if(4&e&&"object"===typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var a in t)r.d(n,a,function(e){return t[e]}.bind(null,a));return n},r.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return r.d(e,"a",e),e},r.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},r.p="/3D-Cellular-Automata/",r(r.s=0)}([function(t,e,r){"use strict";function n(t,e){(null==e||e>t.length)&&(e=t.length);for(var r=0,n=new Array(e);r<e;r++)n[r]=t[r];return n}function a(t,e){if(t){if("string"===typeof t)return n(t,e);var r=Object.prototype.toString.call(t).slice(8,-1);return"Object"===r&&t.constructor&&(r=t.constructor.name),"Map"===r||"Set"===r?Array.from(r):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?n(t,e):void 0}}function s(t,e){return function(t){if(Array.isArray(t))return t}(t)||function(t,e){if("undefined"!==typeof Symbol&&Symbol.iterator in Object(t)){var r=[],n=!0,a=!1,s=void 0;try{for(var i,o=t[Symbol.iterator]();!(n=(i=o.next()).done)&&(r.push(i.value),!e||r.length!==e);n=!0);}catch(u){a=!0,s=u}finally{try{n||null==o.return||o.return()}finally{if(a)throw s}}return r}}(t,e)||a(t,e)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function i(t){if("undefined"===typeof Symbol||null==t[Symbol.iterator]){if(Array.isArray(t)||(t=a(t))){var e=0,r=function(){};return{s:r,n:function(){return e>=t.length?{done:!0}:{done:!1,value:t[e++]}},e:function(t){throw t},f:r}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var n,s,i=!0,o=!1;return{s:function(){n=t[Symbol.iterator]()},n:function(){var t=n.next();return i=t.done,t},e:function(t){o=!0,s=t},f:function(){try{i||null==n.return||n.return()}finally{if(o)throw s}}}}function o(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function u(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}function l(t,e,r){return e&&u(t.prototype,e),r&&u(t,r),t}r.r(e);var c=function(){function t(e){o(this,t),this.shape=e.shape,this.count=e.count,this.XY=e.XY,this.X=e.X,this.cells=e.cells,this.cells_buffer=e.cells_buffer,this.neighbours=e.neighbours,this.updates=e.updates,this.updates_buffer=e.updates_buffer,this.transferables=e.transferables}return l(t,null,[{key:"Create",value:function(e){var r={};return r.shape=e,r.count=e[0]*e[1]*e[2],r.XY=e[0]*e[1],r.X=e[0],r.cells=new Uint8Array(r.count),r.cells_buffer=new Uint8Array(r.count),r.neighbours=new Uint8Array(r.count),r.updates=new Set,r.updates_buffer=new Set,r.transferables=[r.cells.buffer,r.cells_buffer.buffer,r.neighbours.buffer],new t(r)}}]),l(t,[{key:"swap_buffers",value:function(){var t=this.cells;this.cells=this.cells_buffer,this.cells_buffer=t,t=this.updates,this.updates=this.updates_buffer,this.updates_buffer=t}},{key:"xyz_to_i",value:function(t,e,r){return t+e*this.X+r*this.XY}},{key:"i_to_xyz",value:function(t){var e=Math.floor(t/this.XY);t-=e*this.XY;var r=Math.floor(t/this.X);return[t-r*this.X,r,e]}},{key:"i_to_xyz_inplace",value:function(t,e){var r=Math.floor(t/this.XY);t-=r*this.XY;var n=Math.floor(t/this.X),a=t-n*this.X;e[0]=a,e[1]=n,e[2]=r}}]),t}();function f(t){return(f=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function h(){if("undefined"===typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"===typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}function d(t){return(d="function"===typeof Symbol&&"symbol"===typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"===typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function _(t,e){return!e||"object"!==d(e)&&"function"!==typeof e?function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(t):e}function p(t){return function(){var e,r=f(t);if(h()){var n=f(this).constructor;e=Reflect.construct(r,arguments,n)}else e=r.apply(this,arguments);return _(this,e)}}function v(t,e){return(v=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function y(t,e){if("function"!==typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&v(t,e)}var b=function(){function t(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};o(this,t),this.params=e,this.alive_state=255,this.dead_state=0}return l(t,null,[{key:"Create",value:function(t,e){switch(t){case"Seed Crystal":return new m(e);case"Seed Crystal Absolute":return new g(e);default:throw new Error("Invalid randomiser type: ".concat(t))}}}]),t}(),m=function(t){y(r,t);var e=p(r);function r(){return o(this,r),e.apply(this,arguments)}return l(r,[{key:"randomise",value:function(t,e){for(var r=this.params,n=r.radius,a=r.density,s=[Math.max(.5-n,0),Math.min(.5+n,1)],i=s[0],o=s[1],u=t.shape[0]-1,l=t.shape[1]-1,c=t.shape[2]-1,f=[Math.floor(u*i),Math.ceil(u*o)],h=f[0],d=f[1],_=[Math.floor(l*i),Math.ceil(l*o)],p=_[0],v=_[1],y=[Math.floor(c*i),Math.ceil(c*o)],b=y[0],m=y[1],g=h;g<=d;g++)for(var k=p;k<=v;k++)for(var w=b;w<=m;w++){var M=t.xyz_to_i(g,k,w);Math.random()<a&&(t.cells[M]=this.alive_state,e.on_location_update(g,k,w,t,t.updates))}}}]),r}(b),g=function(t){y(r,t);var e=p(r);function r(){return o(this,r),e.apply(this,arguments)}return l(r,[{key:"randomise",value:function(t,e){for(var r=this.params,n=r.radius,a=r.density,s=Math.floor(t.shape[0]/2),i=Math.floor(t.shape[1]/2),o=Math.floor(t.shape[2]/2),u=[Math.max(s-n,0),Math.min(s+n,t.shape[0]-1)],l=u[0],c=u[1],f=[Math.max(i-n,0),Math.min(i+n,t.shape[1]-1)],h=f[0],d=f[1],_=[Math.max(o-n,0),Math.min(o+n,t.shape[2]-1)],p=_[0],v=_[1],y=l;y<=c;y++)for(var b=h;b<=d;b++)for(var m=p;m<=v;m++){var g=t.xyz_to_i(y,b,m);Math.random()<a&&(t.cells[g]=this.alive_state,e.on_location_update(y,b,m,t,t.updates))}}}]),r}(b),k=function(){function t(){o(this,t),this.max_neighbours=26}return l(t,[{key:"count_neighbours",value:function(t,e,r,n,a){for(var s=0,i=-1;i<=1;i++)for(var o=-1;o<=1;o++)for(var u=-1;u<=1;u++)if(0!==i||0!==o||0!==u){var l=M(t+i,n.shape[0]),c=M(e+o,n.shape[1]),f=M(r+u,n.shape[2]),h=n.xyz_to_i(l,c,f),d=n.cells[h];a.is_neighbour(d)&&(s+=1)}return s}},{key:"on_location_update",value:function(t,e,r,n,a){for(var s=-1;s<=1;s++)for(var i=-1;i<=1;i++)for(var o=-1;o<=1;o++){var u=M(t+s,n.shape[0]),l=M(e+i,n.shape[1]),c=M(r+o,n.shape[2]),f=n.xyz_to_i(u,l,c);a.add(f)}}}]),t}(),w=function(){function t(){o(this,t),this.offsets=[];for(var e=0;e<3;e++){var r=[0,0,0],n=[0,0,0];r[e]=1,n[e]=-1,this.offsets.push(r),this.offsets.push(n)}this.max_neighbours=6}return l(t,[{key:"count_neighbours",value:function(t,e,r,n,a){var s,o=0,u=i(this.offsets);try{for(u.s();!(s=u.n()).done;){var l=s.value,c=M(t+l[0],n.shape[0]),f=M(e+l[1],n.shape[1]),h=M(r+l[2],n.shape[2]),d=n.xyz_to_i(c,f,h),_=n.cells[d];a.is_neighbour(_)&&(o+=1)}}catch(p){u.e(p)}finally{u.f()}return o}},{key:"on_location_update",value:function(t,e,r,n,a){var s=n.xyz_to_i(t,e,r);a.add(s);var o,u=i(this.offsets);try{for(u.s();!(o=u.n()).done;){var l=o.value,c=M(t+l[0],n.shape[0]),f=M(e+l[1],n.shape[1]),h=M(r+l[2],n.shape[2]);s=n.xyz_to_i(c,f,h),a.add(s)}}catch(d){u.e(d)}finally{u.f()}}}]),t}();function M(t,e){return(t%e+e)%e}var S=new k,x=new w,O=function(){function t(){o(this,t)}return l(t,null,[{key:"Create",value:function(t){var e=t.type;switch(e){case"M":return S;case"VN":return x;default:throw new Error("Unknown neighbour type: ".concat(e))}}}]),t}(),j=function(){function t(e,r,n,a){o(this,t),this.remain_alive=e,this.become_alive=r,this.total_states=n,this.alive_state=255,this.dead_state=0,this.neighbours=a;var s=(this.alive_state-this.dead_state)/(this.total_states-1);this.alive_threshold=Math.floor(this.alive_state-s/2),this.dead_threshold=Math.floor(s/2),this.delta=Math.floor(s)}return l(t,null,[{key:"Create",value:function(e,r,n,a){return new t(e,r,n,a=O.Create(a))}}]),l(t,[{key:"count_neighbours",value:function(t,e,r,n){return this.neighbours.count_neighbours(t,e,r,n,this)}},{key:"on_location_update",value:function(t,e,r,n,a){this.neighbours.on_location_update(t,e,r,n,a)}},{key:"get_next_state",value:function(t,e){return this.is_alive(t)?this.remain_alive[e]?t:t-this.delta:this.is_dead(t)?this.become_alive[e]?this.alive_state:t:t-this.delta}},{key:"is_neighbour",value:function(t){return t===this.alive_state}},{key:"is_alive",value:function(t){return t>this.alive_threshold}},{key:"is_dead",value:function(t){return t<this.dead_threshold}}]),t}(),X=new(function(){function t(){var e=this;o(this,t),this.listeners=new Set,this.total_steps=0,this.running=!1,this.requested_step=!1,this.completed_frame=!1,this.grid_available=!0,this.local_rerender=!1,this.unprocessed_blocks=new Set,this.tasks={clear:{callback:function(){return e.clear()},queued:!1},randomise:{callback:function(){return e.randomise()},queued:!1}}}return l(t,[{key:"attach_listener",value:function(t){return this.listeners.add(t)}},{key:"remove_listener",value:function(t){return this.listeners.delete(t)}},{key:"notify",value:function(t){var e,r=i(this.listeners);try{for(r.s();!(e=r.n()).done;){(0,e.value)(t)}}catch(n){r.e(n)}finally{r.f()}}},{key:"get_frame",value:function(){if(this.grid&&this.completed_frame){this.completed_frame=!1,this.grid_available=!1;var t=this.unprocessed_blocks;this.unprocessed_blocks=new Set;var e=this.local_rerender;return this.local_rerender=!0,{grid:this.grid,unprocessed_blocks:t,local:e}}}},{key:"start",value:function(){this.running=!0}},{key:"stop",value:function(){this.running=!1}},{key:"run",value:function(){this.loop()}},{key:"loop",value:function(){var t=this;for(var e in this.tasks){var r=this.tasks[e];r.queued&&r.callback()}this.grid_available&&(this.running||this.requested_step)&&(this.calculate_frame(),this.requested_step=!1),setTimeout((function(){return t.loop()}),15)}},{key:"step",value:function(){this.requested_step=!0}},{key:"set_shape",value:function(t){this.grid=c.Create(t),this.unprocessed_blocks.clear(),this.total_steps=0,this.notify({total_steps:this.total_steps,total_blocks:0,completed_blocks:0,frame_time:0}),this.completed_frame=!0,this.local_rerender=!1}},{key:"set_grid",value:function(t){this.grid=new c(t),this.grid_available=!0}},{key:"set_rule",value:function(t){var e=t.remain,r=t.become,n=t.total_states,a=t.neighbour;this.rule=j.Create(e,r,n,a)}},{key:"set_randomiser",value:function(t){var e=t.type,r=t.params;this.randomiser=b.Create(e,r)}},{key:"clear",value:function(){if(this.grid&&this.grid_available){this.tasks.clear.queued=!1;var t=this.grid,e=t.cells,r=t.cells_buffer,n=t.updates,a=t.updates_buffer,s=t.neighbours,i=this.grid.count;e.fill(0,0,i),r.fill(0,0,i),s.fill(0,0,i),n.clear(),a.clear(),this.unprocessed_blocks.clear(),this.total_steps=0,this.notify({total_steps:this.total_steps,total_blocks:0,completed_blocks:0,frame_time:0}),this.completed_frame=!0,this.local_rerender=!1}else this.tasks.clear.queued=!0}},{key:"randomise",value:function(){if(this.randomiser&&this.rule)if(this.grid&&this.grid_available){this.tasks.randomise.queued=!1,this.randomiser.randomise(this.grid,this.rule);var t,e=this.grid.updates.size,r=i(this.grid.updates);try{for(r.s();!(t=r.n()).done;){var n=t.value;this.unprocessed_blocks.add(n)}}catch(a){r.e(a)}finally{r.f()}this.notify({total_blocks:e,completed_blocks:0}),this.completed_frame=!0,this.local_rerender=this.local_rerender&&!0}else this.tasks.randomise.queued=!0}},{key:"calculate_frame",value:function(){var t=this.grid,e=this.rule;if(t&&e){this.grid_available=!1;var r=t.cells,n=t.cells_buffer,a=t.updates,o=t.updates_buffer,u=t.neighbours,l=this.unprocessed_blocks,c=a.size,f=0;this.notify({total_blocks:c,completed_blocks:f});var h,d=[],_=performance.now(),p=i(a);try{for(p.s();!(h=p.n()).done;){var v=h.value,y=s(t.i_to_xyz(v),3),b=y[0],m=y[1],g=y[2],k=e.count_neighbours(b,m,g,t);u[v]=k;var w=r[v],M=e.get_next_state(w,k);n[v]=M,w===M?d.push(v):(e.on_location_update(b,m,g,t,o),l.add(v)),(f+=1)%1e4===0&&this.notify({completed_blocks:f})}}catch(X){p.e(X)}finally{p.f()}for(var S=0,x=d;S<x.length;S++){var O=x[S];a.delete(O)}t.swap_buffers(),this.total_steps+=1;var j=performance.now()-_;this.notify({total_steps:this.total_steps,frame_time:j,completed_blocks:f,total_blocks:c}),this.completed_frame=!0,this.grid_available=!0,this.local_rerender=this.local_rerender&&!0}}}]),t}());X.attach_listener((function(t){postMessage({action:"stats",data:t})})),X.run(),onmessage=function(t){var e=t.data,r=e.action,n=e.id;try{switch(r){case"set_size":return X.set_shape(e.data);case"set_rule":return X.set_rule(e.data);case"set_randomiser":return X.set_randomiser(e.data);case"clear":return X.clear();case"randomise":return X.randomise();case"step":return X.step();case"start":return X.start();case"stop":return X.stop();case"request_frame":return function(){var t=X.get_frame();if(!t)return;var e=t.grid,r=t.unprocessed_blocks,n=t.local;postMessage({action:"grid",grid:e,unprocessed_blocks:r,local:n},e.transferables)}();case"set_grid":return X.set_grid(e.data)}}catch(a){postMessage({error:a,action:r,id:n})}}}]);
//# sourceMappingURL=4093f1cd86ad6b65ac35.worker.js.map