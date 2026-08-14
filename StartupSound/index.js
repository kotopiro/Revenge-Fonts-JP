(function(k,W,S,e,Y,y,f,x){"use strict";const{View:A,Text:U}=x.General,{FormInput:D,FormRow:h,FormSection:E,FormDivider:w}=x.Forms,a=W.storage;Array.isArray(a.trackUrls)||(a.trackUrls=["","",""]),a.activeTrackIndex===void 0&&(a.activeTrackIndex=0),a.loop===void 0&&(a.loop=!1),a.volume===void 0&&(a.volume=1);function L(){try{const t=S.findByProps("WebView");if(t?.WebView)return t.WebView;if(typeof t=="function")return t}catch(t){console.log("[KyukurarinStartupSound] WebView lookup error:",t)}return null}function B(t){try{const i=[/youtu\.be\/([A-Za-z0-9_-]{6,})/,/youtube\.com\/watch\?v=([A-Za-z0-9_-]{6,})/,/youtube\.com\/shorts\/([A-Za-z0-9_-]{6,})/,/youtube\.com\/embed\/([A-Za-z0-9_-]{6,})/];for(const o of i){const n=t.match(o);if(n)return n[1]}}catch{}return null}const P="kyukurarin-audio",T=28,I=20,F="#ff6fa0";function K(t,i,o){const n=B(t);if(n){const u=o?`&loop=1&playlist=${n}`:"";return`<!DOCTYPE html><html><body style="margin:0;background:transparent">
<iframe width="1" height="1" src="https://www.youtube.com/embed/${n}?autoplay=1&playsinline=1${u}" frameborder="0" allow="autoplay"></iframe>
</body></html>`}return`<!DOCTYPE html><html><body style="margin:0;background:transparent;overflow:hidden">
<audio id="${P}" autoplay ${o?"loop":""}
  onerror="window.ReactNativeWebView && window.ReactNativeWebView.postMessage('error')">
<source src="${t}">
</audio>
<canvas id="viz" width="${T}" height="${I}" style="display:block;"></canvas>
<script>
var audio = document.getElementById('${P}');
if (audio) { audio.volume = ${i}; }

try {
    var canvas = document.getElementById('viz');
    var ctx = canvas.getContext('2d');
    var AudioContextClass = window.AudioContext || window.webkitAudioContext;
    var actx = new AudioContextClass();
    var source = actx.createMediaElementSource(audio);
    var analyser = actx.createAnalyser();
    analyser.fftSize = 32;
    source.connect(analyser);
    analyser.connect(actx.destination);
    var bufferLength = analyser.frequencyBinCount;
    var dataArray = new Uint8Array(bufferLength);

    function draw() {
        requestAnimationFrame(draw);
        analyser.getByteFrequencyData(dataArray);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        var barWidth = canvas.width / bufferLength;
        for (var i = 0; i < bufferLength; i++) {
            var v = dataArray[i] / 255;
            var h = Math.max(1, v * canvas.height);
            ctx.fillStyle = '${F}';
            ctx.fillRect(i * barWidth, canvas.height - h, Math.max(1, barWidth - 1), h);
        }
    }
    draw();
} catch (e) {
    window.ReactNativeWebView && window.ReactNativeWebView.postMessage('viz-error');
}
<\/script>
</body></html>`}function _(){try{return S.find(function(t){return t?.name==="YouBarNotificationsButton"||t?.displayName==="YouBarNotificationsButton"||t?.type?.name==="YouBarNotificationsButton"||t?.type?.displayName==="YouBarNotificationsButton"})??null}catch(t){return console.log("[KyukurarinStartupSound] You Bar lookup error:",t),null}}let b=null;function $(t,i=6){const o=_();if(!o){if(i<=0){y.showToast("Couldn't find the You Bar button (try restarting Discord)",{key:"kyukurarin-youbar-notfound"});return}b=setTimeout(function(){return $(t,i-1)},1500);return}const n=L(),u=f.getAssetIDByName("PlayIcon")??f.getAssetIDByName("PlaySmallIcon"),g=f.getAssetIDByName("StopIcon")??f.getAssetIDByName("CircleXIcon")??u,c=Y.instead("type",o,function(v,r){const[s,l]=e.React.useState(!1),[Z,j]=e.React.useState(0),m=r(...v);try{const d=m?.props?.children,C=Array.isArray(d)?d[0]:d,z=C?.type??null,M=C?.props??{},p=(a.trackUrls??[])[a.activeTrackIndex??0]??"",G=function(){if(!p){y.showToast("No track set (check plugin settings)",{key:"kyukurarin-no-track"});return}s?l(!1):(l(!0),j(function(R){return R+1}))},H=z?e.React.createElement(z,{variant:M?.variant||"tertiary",size:M?.size||"sm",icon:s?g:u,onPress:G}):null,X=s&&p&&n?e.React.createElement(A,{style:B(p)?{width:1,height:1,opacity:0}:{width:T,height:I,marginHorizontal:4}},e.React.createElement(n,{key:Z,source:{html:K(p,a.volume??1,!!a.loop)},mediaPlaybackRequiresUserAction:!1,allowsInlineMediaPlayback:!0,backgroundColor:"transparent",onMessage:function(R){const V=R?.nativeEvent?.data;V==="error"?y.showToast("Playback failed",{key:"kyukurarin-play-error"}):V==="viz-error"&&console.log("[KyukurarinStartupSound] Waveform failed to start")}})):null;return e.React.createElement(e.React.Fragment,null,H,X,m)}catch(d){return console.log("[KyukurarinStartupSound] You Bar button injection error:",d),m}});t(c)}function q(){const[t,i]=e.React.useState(a.trackUrls??["","",""]),[o,n]=e.React.useState(a.activeTrackIndex??0),[u,g]=e.React.useState(!!a.loop),[c,v]=e.React.useState(a.volume??1);return e.React.createElement(A,{style:{flex:1}},e.React.createElement(E,{title:"Playlist (up to 3 tracks)"},[0,1,2].map(function(r){return e.React.createElement(D,{key:r,title:`Track ${r+1} URL${o===r?" (active)":""}`,value:t[r]??"",placeholder:"https://example.com/mysound.mp3 or a YouTube URL",onChange:function(s){const l=[...t];l[r]=s,i(l),a.trackUrls=l}})}),e.React.createElement(w,null),[0,1,2].map(function(r){return e.React.createElement(h,{key:r,label:`Set Track ${r+1} as active`,onPress:function(){n(r),a.activeTrackIndex=r}})})),e.React.createElement(E,{title:"Playback"},e.React.createElement(h,{label:`Loop: ${u?"On":"Off"}`,onPress:function(){const r=!u;g(r),a.loop=r}}),e.React.createElement(w,null),e.React.createElement(h,{label:`Volume up (currently ${Math.round(c*100)}%)`,onPress:function(){const r=Math.min(1,c+.1);v(r),a.volume=r}}),e.React.createElement(w,null),e.React.createElement(h,{label:`Volume down (currently ${Math.round(c*100)}%)`,onPress:function(){const r=Math.max(0,c-.1);v(r),a.volume=r}})),e.React.createElement(U,{style:{padding:12,opacity:.7}},"Provide your own hosted audio files. Do not distribute or share copyrighted audio without permission. Tap the button added to the You Bar to play/stop the active track. Volume changes apply the next time playback starts."))}let N=function(){};var O={onLoad:function(){try{$(function(t){N=t})}catch(t){console.log("[KyukurarinStartupSound] onLoad error:",t),y.showToast("Plugin failed to initialize",{key:"kyukurarin-load-error"})}},onUnload:function(){try{b&&clearTimeout(b),N()}catch(t){console.log("[KyukurarinStartupSound] onUnload error:",t)}},settings:q};return k.default=O,Object.defineProperty(k,"__esModule",{value:!0}),k})({},vendetta.plugin,vendetta.metro,vendetta.metro.common,vendetta.patcher,vendetta.ui.toasts,vendetta.ui.assets,vendetta.ui.components);
