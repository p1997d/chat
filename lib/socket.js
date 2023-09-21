module.exports = function( io, app, firebase, upload, updateList ){	
	var connections = [],
		time = null;
	
	class Socket {
		constructor( data, time ) {
			this.data = data;
			this.time = time;
		}
		
		message() {
			let type = ( this.data.fileBool ) ? 'progress' : 'none';					
			firebase.database.ref( 'CyberPashka/' + this.time ).set({
				name: this.data.name,
				message: this.data.message,
				filetype: type,
			});			
			updateList().then( list => {
				io.sockets.emit( 'newMessage', {list: list} );
			});
		}
		
		name() {
			updateList().then( list => {
				io.sockets.emit( 'newMessage', {list: list} );
			});		
		}
		
		typing() {
			io.sockets.emit( 'anotherUserTyping', { name: this.data.name });
		}
		
		notTyping() {
			io.sockets.emit( 'anotherUserNotTyping', { name: this.data.name });
		}
		
		deleteMessage() {
			var base = firebase.database.ref( 'CyberPashka/' + this.data.message );
			base.get().then(( snapshot ) => {
				let file = snapshot.val();
				if ( file.filetype != 'none' ) {
					firebase.storage.ref().child( file.filetype + '/' + file.filename ).delete().then( () => {
						deleteMessage();					
					}).catch(( error ) => {
						deleteMessage();
					});
				} else {
					deleteMessage();
				}
			}).catch(( error ) => {
				console.error( error );
			});
			function deleteMessage(){						
				base.remove().then( () => {
					updateList().then( list => {
						io.sockets.emit( 'newMessage', {list: list} );
					});
				});
			}
		}
	}

	io.sockets.on( 'connection' , function( socket ) {
		console.log( 'connection' );
		connections.push( socket );
		socket.on( 'disconnect', function( data ) {
			connections.splice( connections.indexOf( socket ), 1);
			console.log( 'disconnect' );
		});
		
		socket.on( 'message', function( data ) {
			time = new Date().getTime();
			let s = new Socket( data, time );
			s.message();
			if(data.fileBool){
				upload(time, app, io);
			}
		});
		socket.on( 'name', function( data ) {
			let s = new Socket( data );
			s.name();
		});
		socket.on( 'typing', function( data ) {
			let s = new Socket( data );
			s.typing();
		});
		socket.on( 'notTyping', function( data ) {
			let s = new Socket( data );
			s.notTyping();
		});
		socket.on( 'deleteMessage', function( data ) {
			let s = new Socket( data );
			s.deleteMessage();
		});	
	});
}