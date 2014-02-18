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
    mappingToIdol: function(items) {
      var result = [];
      angular.forEach(items, function(item){
        result.push({
          first_day:      item.c[0].v == '○',
          second_day:     item.c[1].v == '○',
          affiliation:    item.c[2].v,
          name:           item.c[3].v,
          character:      item.c[4].v,
          attribute:      item.c[5].v,
          color:          item.c[6].v,
          style:          item.c[6].p.style.replace("font-family:Dialog;", ""),
          nickname:       item.c[7].v,
          song:           item.c[8].v,
          call_song:      item.c[9].v,
          song_link:      item.c[11].v,
          remark:         item.c[12].v,
          call_link:      item.c[14].v,
          link:           item.c[16].v,
          character_link: item.c[18].v
        });
      });
      return result;
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
