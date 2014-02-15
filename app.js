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
      $.each(rows, function(index, row){
        idol = {
          first_day: row.c[0].v == '○',
          second_day: row.c[1].v == '○',
          affiliation: row.c[2].v,
          name: row.c[3].v,
          link: row.c[13].v,
          character: row.c[4].v,
          character_link: row.c[15].v,
          attribute: row.c[5].v,
          color: row.c[6].v,
          style: row.c[6].p.style,
          nickname: row.c[7].v,
          song: row.c[8].v,
          song_link: row.c[10].v,
          remark: row.c[11].v
        };
        idols.push(idol);
      });
      return idols;
    }
  };
})

.factory('query', function(AppConfig) {
  var url = AppConfig.BASE_URL + AppConfig.SPREADSHEET_KEY + "&gid=0";
  return new google.visualization.Query(url);
})

.controller('IdolCtrl', function($scope, Utils, query) {
  query.send(function(response) {
    var dataTable = JSON.parse(response.getDataTable().toJSON());
    $scope.$apply(function() {
      var idols = Utils.mappingToIdol(dataTable.rows.slice(1));
      $scope.idolsRows = Utils.splitIntoRows(idols, 3);
      console.log($scope.idolsRows);
    });
  });
});
