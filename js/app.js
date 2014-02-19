angular.module('app', [])

.value('AppConfig', {
  SPREADSHEET_KEY: "0AiYLrpOi8EdddGJtdTZyQm9MdUtvamxiNll2bUtTeGc",
  BASE_URL: "http://spreadsheets.google.com/ccc?key="
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
          first_day:      col[0].v == '○',
          second_day:     col[1].v == '○',
          affiliation:    col[2].v,
          performer:      col[3].v,
          character:      col[4].v,
          attribute:      col[5].v,
          color:          col[6].v,
          style:          col[6].p.style.replace("font-family:Dialog;", ""),
          nickname:       col[7].v,
          song:           col[8].v,
          call_song:      col[9].v,
          song_link:      col[11].v,
          remark:         col[12].v,
          call_link:      col[14].v,
          performer_link: col[16].v === "-" ? null : col[16].v,
          character_link: col[18].v
        });
      });
      return idols;
    }
  };
})

.factory('Query', function(AppConfig) {
  var url = AppConfig.BASE_URL + AppConfig.SPREADSHEET_KEY + "&gid=0";
  return new google.visualization.Query(url);
})

.controller('IdolCtrl', function($scope, Utils, Query) {
  Query.send(function(response) {
    var dataTable = JSON.parse(response.getDataTable().toJSON());
    var idols = Utils.mappingToIdol(dataTable.rows.slice(1));

    $scope.$apply(function() {
      $scope.idolsRows = Utils.splitIntoRows(idols, 3);
    });
  });
});
