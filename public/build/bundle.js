var app=function(){"use strict";function t(){}function e(t,e){for(const n in e)t[n]=e[n];return t}function n(t){return t()}function o(){return Object.create(null)}function r(t){t.forEach(n)}function s(t){return"function"==typeof t}function c(t,e){return t!=t?e==e:t!==e||t&&"object"==typeof t||"function"==typeof t}function i(t,e){t.appendChild(e)}function l(t,e,n){t.insertBefore(e,n||null)}function u(t){t.parentNode.removeChild(t)}function a(t){return document.createElement(t)}function f(t){return document.createTextNode(t)}function d(){return f(" ")}function h(t,e,n,o){return t.addEventListener(e,n,o),()=>t.removeEventListener(e,n,o)}function g(t,e,n){null==n?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}function p(t,e){t.value=null==e?"":e}function $(t,e,n,o){t.style.setProperty(e,n,o?"important":"")}let m;function v(t){m=t}const y=[],x=[],b=[],_=[],w=Promise.resolve();let k=!1;function E(t){b.push(t)}let j=!1;const A=new Set;function M(){if(!j){j=!0;do{for(let t=0;t<y.length;t+=1){const e=y[t];v(e),O(e.$$)}for(v(null),y.length=0;x.length;)x.pop()();for(let t=0;t<b.length;t+=1){const e=b[t];A.has(e)||(A.add(e),e())}b.length=0}while(y.length);for(;_.length;)_.pop()();k=!1,j=!1,A.clear()}}function O(t){if(null!==t.fragment){t.update(),r(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(E)}}const V=new Set;function C(t,e){t&&t.i&&(V.delete(t),t.i(e))}function N(t,e,o,c){const{fragment:i,on_mount:l,on_destroy:u,after_update:a}=t.$$;i&&i.m(e,o),c||E((()=>{const e=l.map(n).filter(s);u?u.push(...e):r(e),t.$$.on_mount=[]})),a.forEach(E)}function L(t,e){const n=t.$$;null!==n.fragment&&(r(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx=[])}function P(t,e){-1===t.$$.dirty[0]&&(y.push(t),k||(k=!0,w.then(M)),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}function S(e,n,s,c,i,l,a=[-1]){const f=m;v(e);const d=e.$$={fragment:null,ctx:null,props:l,update:t,not_equal:i,bound:o(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(f?f.$$.context:n.context||[]),callbacks:o(),dirty:a,skip_bound:!1};let h=!1;if(d.ctx=s?s(e,n.props||{},((t,n,...o)=>{const r=o.length?o[0]:n;return d.ctx&&i(d.ctx[t],d.ctx[t]=r)&&(!d.skip_bound&&d.bound[t]&&d.bound[t](r),h&&P(e,t)),n})):[],d.update(),h=!0,r(d.before_update),d.fragment=!!c&&c(d.ctx),n.target){if(n.hydrate){const t=function(t){return Array.from(t.childNodes)}(n.target);d.fragment&&d.fragment.l(t),t.forEach(u)}else d.fragment&&d.fragment.c();n.intro&&C(e.$$.fragment),N(e,n.target,n.anchor,n.customElement),M()}v(f)}class T{$destroy(){L(this,1),this.$destroy=t}$on(t,e){const n=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return n.push(e),()=>{const t=n.indexOf(e);-1!==t&&n.splice(t,1)}}$set(t){var e;this.$$set&&(e=t,0!==Object.keys(e).length)&&(this.$$.skip_bound=!0,this.$$set(t),this.$$.skip_bound=!1)}}function q(t,e,n){const o=t.slice();return o[10]=e[n],o[12]=n,o}function B(t){let e;return{c(){e=a("li"),$(e,"--guage-width","3%"),$(e,"--guage-tick",t[12]),g(e,"class","svelte-1uaafd9")},m(t,n){l(t,e,n)},d(t){t&&u(e)}}}function W(t){let e,n,o,r=10*t[12]+"";return{c(){e=a("li"),n=a("span"),o=f(r),g(n,"class","svelte-1uaafd9"),$(e,"--guage-width","5%"),$(e,"--guage-tick",t[12]),g(e,"class","svelte-1uaafd9")},m(t,r){l(t,e,r),i(e,n),i(n,o)},d(t){t&&u(e)}}}function z(e){let n;let o=function(t,e){return t[12]%3==0?W:B}(e)(e);return{c(){o.c(),n=f("")},m(t,e){o.m(t,e),l(t,n,e)},p:t,d(t){o.d(t),t&&u(n)}}}function D(e){let n,o,s,c,$,m,v,y,x,b,_,w,k,E,j,A=Math.floor(2.7*e[0])+"",M=Array(e[1]+1),O=[];for(let t=0;t<M.length;t+=1)O[t]=z(q(e,M,t));return{c(){n=a("div"),o=a("div"),s=a("div"),c=a("ol");for(let t=0;t<O.length;t+=1)O[t].c();$=d(),m=a("aside"),v=d(),y=a("p"),x=f(A),b=d(),_=a("span"),_.textContent="km/h",w=d(),k=a("input"),g(c,"class","svelte-1uaafd9"),g(m,"class","needle svelte-1uaafd9"),g(_,"class","svelte-1uaafd9"),g(y,"class","value svelte-1uaafd9"),g(s,"class","outline svelte-1uaafd9"),g(o,"class","speedMeter svelte-1uaafd9"),g(n,"class","speedMeterWrapper svelte-1uaafd9"),g(n,"style",e[2]),g(k,"type","range"),g(k,"min","0"),g(k,"max","100")},m(t,r){l(t,n,r),i(n,o),i(o,s),i(s,c);for(let t=0;t<O.length;t+=1)O[t].m(c,null);i(s,$),i(s,m),i(s,v),i(s,y),i(y,x),i(y,b),i(y,_),l(t,w,r),l(t,k,r),p(k,e[0]),E||(j=[h(k,"change",e[8]),h(k,"input",e[8])],E=!0)},p(t,[e]){if(2&e){let n;for(M=Array(t[1]+1),n=0;n<M.length;n+=1){const o=q(t,M,n);O[n]?O[n].p(o,e):(O[n]=z(o),O[n].c(),O[n].m(c,null))}for(;n<O.length;n+=1)O[n].d(1);O.length=M.length}1&e&&A!==(A=Math.floor(2.7*t[0])+"")&&function(t,e){e=""+e,t.wholeText!==e&&(t.data=e)}(x,A),4&e&&g(n,"style",t[2]),1&e&&p(k,t[0])},i:t,o:t,d(t){t&&u(n),function(t,e){for(let n=0;n<t.length;n+=1)t[n]&&t[n].d(e)}(O,t),t&&u(w),t&&u(k),E=!1,r(j)}}}function F(t,e,n){let o,{height:r=200}=e,{width:s=200}=e,{start:c=0}=e,{end:i=100}=e,{scales:l=10}=e;const u=i-c;let{meterValue:a=0}=e;const f={height:`${r}px`,width:`${s}px`,"scale-deg":u/l+"deg","offset-deg":`${c}deg`,"outline-border":"4px","scale-height":"2px","scale-origin":r/2+"px 0px","meter-deg":"90deg"};return t.$$set=t=>{"height"in t&&n(3,r=t.height),"width"in t&&n(4,s=t.width),"start"in t&&n(5,c=t.start),"end"in t&&n(6,i=t.end),"scales"in t&&n(1,l=t.scales),"meterValue"in t&&n(0,a=t.meterValue)},t.$$.update=()=>{33&t.$$.dirty&&n(7,f["meter-deg"]=`${u/100*a+c}deg`,f),128&t.$$.dirty&&n(2,o=Object.entries(f).map((([t,e])=>`--${t}:${e}`)).join(";"))},[a,l,o,r,s,c,i,f,function(){var t;t=this.value,a=""===t?null:+t,n(0,a)}]}class G extends T{constructor(t){super(),S(this,t,F,D,c,{height:3,width:4,start:5,end:6,scales:1,meterValue:0})}}function H(t){let n,o,r;const s=[t[0]];let c={};for(let t=0;t<s.length;t+=1)c=e(c,s[t]);return o=new G({props:c}),{c(){var t;n=a("main"),(t=o.$$.fragment)&&t.c()},m(t,e){l(t,n,e),N(o,n,null),r=!0},p(t,[e]){const n=1&e?function(t,e){const n={},o={},r={$$scope:1};let s=t.length;for(;s--;){const c=t[s],i=e[s];if(i){for(const t in c)t in i||(o[t]=1);for(const t in i)r[t]||(n[t]=i[t],r[t]=1);t[s]=i}else for(const t in c)r[t]=1}for(const t in o)t in n||(n[t]=void 0);return n}(s,[(r=t[0],"object"==typeof r&&null!==r?r:{})]):{};var r;o.$set(n)},i(t){r||(C(o.$$.fragment,t),r=!0)},o(t){!function(t,e,n,o){if(t&&t.o){if(V.has(t))return;V.add(t),(void 0).c.push((()=>{V.delete(t),o&&(n&&t.d(1),o())})),t.o(e)}}(o.$$.fragment,t),r=!1},d(t){t&&u(n),L(o)}}}function I(t){return[{height:300,width:300,start:-30,end:210,scales:27}]}return new class extends T{constructor(t){super(),S(this,t,I,H,c,{})}}({target:document.body})}();
//# sourceMappingURL=bundle.js.map
