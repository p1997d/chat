var firebase = require( './firebase' );
var starCountRef = firebase.database.ref( 'CyberPashka/' );

var updateList = function(){
	return new Promise(( resolve, reject ) => {			
		starCountRef.on( 'value', ( snapshot ) => {
			const data = snapshot.val();
			list = [];
			Object.values( data ).forEach( function( item, i ){
				let time = new Date();
				let time2 = new Date();
				time.setTime( Object.keys( data )[i] );
				time2.setTime( Object.keys( data )[i-1] );
				let D = time.getDate();
				let D1 = time2.getDate();
				let M;
				switch( time.getMonth() + 1 ){
					case 1:
						M = 'января';
						break;
					case 2:
						M = 'февраля';
						break;
					case 3:
						M = 'марта';
						break;
					case 4:
						M = 'апреля';
						break;
					case 5:
						M = 'мая';
						break;
					case 6:
						M = 'июня';
						break;
					case 7:
						M = 'июля';
						break;
					case 8:
						M = 'августа';
						break;
					case 9:
						M = 'сентября';
						break;
					case 10:
						M = 'октября';
						break;
					case 11:
						M = 'ноября';
						break;
					case 12:
						M = 'декабря';
						break;
				}
				let Y = time.getFullYear();
				let h = time.getHours();
				let m = ( time.getMinutes() < 10 ) ? '0' + time.getMinutes() : time.getMinutes();
				let date = ( D != D1 ) ? `<div class="date">${D} ${M} ${Y}</div><br/>` : '';
				url = item.file;
				switch( item.filetype ){
					case "image":
						ft = `<img class="imgMessage" src="${url}">`;
						break;
					case "audio":
						ft = `<audio class="audioMessage" src="${url}" controls></audio>`;
						break;
					case "video":
						ft = `<video class="videoMessage" src="${url}" controls></video>`;
						break;
					case "progress":
						ft = `<img class="progressMessage" src="./images/spinner.gif" />`;
						break;
					case "none":
						ft = ``;
						break;
					default:
						ft = `<a class="otherMessage" href="${url}">${item.filename}</a>`;
						break;						
				};
				list.push(`${date}<div class="message" id="${time.getTime()}"><b class="nameMessage">${item.name}</b> ${h}:${m}\n${item.message}<br/>${ft}</div><hr/>`);				
			});
			resolve( list );
		});
	});
}

module.exports = updateList;