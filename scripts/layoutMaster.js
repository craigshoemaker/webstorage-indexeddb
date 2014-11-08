var layoutMaster = (function() {
    var lm = {
        _header: '<header class="container"><nav class="navbar navbar-default" role="navigation">' +
'              <div class="navbar-header">' +
'                <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-ex1-collapse">' +
'                  <span class="sr-only">Toggle navigation</span>' +
'                  <span class="icon-bar"></span>' +
'                  <span class="icon-bar"></span>' +
'                  <span class="icon-bar"></span>' +
'                </button>' +
'                <a class="navbar-brand" href="../../index.html"><img src="../../img/course-logo.png" class="img-responsive" alt="HTML5 Client-Side Persistent Apps" title="HTML5 Client-Side Peristent Apps" /></a>' +
'              </div>' +
'' +
'              <div class="collapse navbar-collapse navbar-ex1-collapse">' +
'                <ul class="nav navbar-nav">' +
'                  <li class="dropdown">' +
'                    <a href="#" class="dropdown-toggle" data-toggle="dropdown"><i class="fa fa-hdd-o"></i> Storage <b class="caret"></b></a>' +
'                    <ul class="dropdown-menu">' +
'                      <li><a href="../../demos/storage/01-local-api.html">Local Storage API</a></li>' +
'                      <li><a href="../../demos/storage/02-session-api.html">Session Storage API</a></li>' +
'                      <li><a href="../../demos/storage/03-exceedquota.html">Exceeding Storage Quota</a></li>' +
'                      <li><a href="../../demos/storage/04-storage-event.html">Storage Event</a></li>' +
'                      <li class="divider"></li>' +
'                      <li><a href="../../demos/storage/05-persistentform.html"><i class="fa fa-laptop"></i> Persistent Form</a></li>' +
'                    </ul>' +
'                  </li>' +
'                  <li class="dropdown">' +
'                    <a href="#" class="dropdown-toggle" data-toggle="dropdown"><i class="fa fa-sort-amount-desc"></i> IndexedDB <b class="caret"></b></a>' +
'                    <ul class="dropdown-menu">' +
'                      <li><a href="../../demos/indexeddb/01-initialization.html">Construction &amp; Destruction</a></li>' +
'                      <li><a href="../../demos/indexeddb/02-crud.html">CRUD Operations</a></li>' +
'                      <li><a href="../../demos/indexeddb/03-cursor.html">Cursors, Indexes &amp; Ranges</a></li>' +
'                      <li><a href="../../demos/indexeddb/04-keys.html">Keys</a></li>' +
'                      <li><a href="../../demos/indexeddb/06-versions.html">Versions</a></li>' +
'                      <li class="divider"></li>' +
'                      <li><a href="../../demos/indexeddb/07-homes.html"><i class="fa fa-laptop"></i> Homes List</a></li>' +
'                    </ul>' +
'                  </li>' +
'                </ul>' +
'<button type="button" class="btn btn-default icon-question-sign navbar-right" style="border:0px;margin-top:10px;background-color:transparent;" data-toggle="modal" data-target="#explanation"></button>' +
'              </div>' +
'            </nav></header>',

        renderHeader: function() {
            $('body').prepend(lm._header);
        },

        renderFooter: function() {
            $('body').append('<footer>From: <a href="http://pluralsight.com/courses/html5-web-storage-indexeddb-file-system" target="_blank">HTML5 Web Storage, IndexedDB and File System</a> by <a href="http://twitter.com/craigshoemaker" target="_blank"><img src="../../img/craig-shoemaker-logo.png" /></a></footer>');
        },

        renderAll: function() {

            lm.renderHeader();
            lm.renderFooter();

            $('article').fadeIn();

            if ($('#explanation').length === 0) {
                $('button[data-target="#explanation"]').hide();
            }
        }
    };

    $(function() {
        lm.renderAll();
    });

})();