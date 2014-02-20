angular.module('app', [])

.value('AppConfig', {
  SPREADSHEET_KEY: '0AiYLrpOi8EdddGJtdTZyQm9MdUtvamxiNll2bUtTeGc',
  BASE_URL: 'http://spreadsheets.google.com/ccc?key='
})

.factory('Utils', function() {
  return {
    splitIntoRows: function(array, size) {
      if (!Array.isArray(array) || size < 1) {
        return array;
      }

      var rows= [];
      var length = array.length;
      for(var i = 0; i < length; i += size) {
        rows.push(array.slice(i, i + size));
      }
      return rows;
    },
    mappingToIdol: function(rows) {
      var idols = [];
      angular.forEach(rows, function(row){
        var col = row.c;

        idols.push({
          first_day:      col[0].v === '○',
          second_day:     col[1].v === '○',
          affiliation:    col[2].v,
          performer:      col[3].v,
          character:      col[4].v === '-' ? null : col[4].v,
          attribute:      col[5].v,
          color:          col[6].v,
          style:          col[6].p.style.replace('font-family:Dialog;', ''),
          nickname:       col[7].v,
          song:           col[8].v,
          call_song:      col[9].v,
          song_link:      col[11].v,
          remark:         col[12].v,
          call_link:      col[14].v,
          performer_link: col[16].v === '-' ? null : col[16].v,
          character_link: col[18].v,
          hentai:         col[3].v === '坂上陽三'
        });
      });
      return idols;
    }
  };
})

.factory('Query', function(AppConfig) {
  var url = AppConfig.BASE_URL + AppConfig.SPREADSHEET_KEY + '&gid=0';
  return new google.visualization.Query(url);
})

.controller('IdolCtrl', function($scope, Utils, Query) {
  $scope.loading = true;

  Query.send(function(response) {
    var dataTable = JSON.parse(response.getDataTable().toJSON());
    var idols = Utils.mappingToIdol(dataTable.rows.slice(1));

    $scope.$apply(function() {
      $scope.loading = false;
      $scope.idolsRows = Utils.splitIntoRows(idols, 3);
    });
  });
})

.directive('scrollTop', function($timeout) {
  return {
    link: function(scope, element, attrs) {
      element.on('click', function(e) {
        e.preventDefault();

        (function _scrollTop() {
          if(document.body.scrollTop === 0) {
            return;
          }
          document.body.scrollTop -= 100;
          $timeout(_scrollTop, 10);
        })();
      });
    }
  }
})

.directive('hentai', function($timeout) {
  var hentaiMode = false;
  return {
    link: function(scope, element, attrs) {
      element.on('click', function(e) {
        e.preventDefault();
        if(hentaiMode) {
          return;
        }
        hentaiMode = true; // hentai mode start

        var hentai = Math.floor(Math.random() * 10) < 8;
        var neta = hentai ? '変態' : '72';
        var netaClass = hentai ? 'hentai-uo' : 'chihaya';
        var $body = angular.element(document.body);
        $body.addClass(netaClass);

        // TODO Danger
        var $canvas = angular.element('<canvas style="top: 0px; left: 0px; position: fixed;"></canvas>');
        $body.append($canvas);

        var canvas = $canvas[0];
        canvas.height = window.innerHeight;
        canvas.width = window.innerWidth;
        var ctx = canvas.getContext('2d');
        var fontSize = canvas.width / 40;
        ctx.font = 'bold ' + parseInt(fontSize) + 'em ' + "'Arial'";
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        ctx.fillText(neta, 0, 0);
        var pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
        var data = pixels.data;
        var textHeight = 0;
        var currentRow = -1;
        for (var i = 0, len = data.length; i < len; i += 4) {
          var r = data[i], g = data[i+1], b = data[i+2], alpha = data[i+3];
          if (alpha > 0) {
            var row = Math.floor((i / 4) / canvas.width);
            if (row > currentRow) {
              currentRow = row;
              textHeight++;
            }
          }
        }
        textHeight -= 80;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.save();
        ctx.fillText(neta, canvas.width / 2, (canvas.height - textHeight) / 2);
        ctx.restore();

        $timeout(function() {
          $body.removeClass(netaClass);
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          $canvas.remove();
          hentaiMode = false; // hentai mode end
        }, 5000);
      });
    }
  };
});
