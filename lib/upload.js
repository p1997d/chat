module.exports = function(time, app, io){
	var multer = require( 'multer' ),
		fs = require( 'fs' ),
		updateList = require( './updateList' ),
		firebase = require( './firebase' );
		
	var storage = multer.diskStorage({
		destination: function ( req, file, callback ) {
			callback( null, './files' );
		},
		filename: function ( req, file, callback ) {
			type = file.mimetype.split( '/' );		
			file = file.fieldname + '-' + time + '.' + type[1];
			callback( null, file );		
		}
	});
	
	var upload = multer({ storage : storage }).single( 'file' );
	
	app.post( '/upload', function( req, res ){
		upload( req, res, function( err ) {
			if( req.file != undefined){
				if( err ) {
					return res.end( 'Error uploading file.' );
				}
				res.end( 'File is uploaded' );			
				fp = req.file.filename;
				file = fs.readFileSync( './files/' + fp );
				switch( type[0] ){
					case "image":
						fileType = "image";
						break;
					case "audio":
						fileType = "audio";
						break;
					case "video":
						fileType = "video";
						break;
					default:
						fileType = "other";
						break;							
				};		
				filePath = `${fileType}/${fp}`;
				uploadTask = firebase.storage.ref().child( filePath ).put( file );
				uploadTask.on( 'state_changed', ( snapshot ) => {
					var progress = ( snapshot.bytesTransferred / snapshot.totalBytes ) * 100;
					console.log( 'Upload is ' + progress + '% done' );
				}, ( error ) => {
					console.log( error );
				}, () => {
					uploadTask.snapshot.ref.getDownloadURL().then(( downloadURL ) => {
						firebase.database.ref( 'CyberPashka/' + time ).update({
							file: 		downloadURL,
							filetype: 	type[0],
							filename: 	fp,
						});	
						updateList().then( list => {
							io.sockets.emit( 'newMessage', {list: list} );
						});
						console.log( 'File available at', downloadURL );
					});
				  }
				);
			}
		});
	});
}