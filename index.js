var path = require( 'path' ),
	express = require( 'express' ),
	app = express(),
	fs = require( 'fs' ),
	http = require( 'https' ),
	server = require( 'http' ).createServer( app ),
	io = require( 'socket.io' )( server ),
	port = process.env.PORT || 8080,
	firebase = require( './lib/firebase' ),
	updateList = require( './lib/updateList' ),
	upload = require( './lib/upload' );
	
require( './lib/socket' )( io, app, firebase, upload, updateList )
	
app.get( "/", function ( req, res ){
	res.writeHead( 200, { 'Content-Type': 'text/html; charset=utf8' });
	fs.createReadStream( './index.html', 'utf8' ).pipe( res );
});
app.use( '/files', express.static( 'files' ));
app.use( '/images', express.static( 'images' ));

server.listen( port, function(){
	console.log( 'Express server listening on port ' + port );
});