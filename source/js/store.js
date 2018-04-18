(function() {

  var interfaceBlocks = {
    serverLog: document.querySelector( '.view-stub__label' )
  }

  function createNewEvent( evt, elem, data ) {
    var newEvent = new CustomEvent( evt, {
      cancelable: true,
      detail: data
    });
    elem.dispatchEvent( newEvent );
  };

  var handlerChange = {
    'input': function( action ) {
      logging( 'Store отправляет данные на сервер', action.data );
      return server.sendToServer( action.data )
        .then( function( result ) {
          logging( 'Store запрашивает данные с сервера' );
          return server.queryToServer( 'report' );
        })
        .then( function ( report ) {
          logging( 'Store вызывает событие изменения' );
          createNewEvent( 'change', interfaceBlocks.serverLog, report );
        })
        .catch( function( err ) {
          logging( err );
        })
    }
  }

  window.store = {
    handlerAction: function( action ) {
      logging( 'Store получил Action', action );
      if ( action.data ) {
        if ( handlerChange[ action.name ] ) {
          logging( 'Store обрабатывает полученное событие' );
          handlerChange[ action.name ]( action );
        } else {
          logging( 'Store не содержит инструкций для этого события' );
        }
      } else {
        logging( 'Action, полученный Store, содержит некоректные данные' );
      }
    }
  };

})();