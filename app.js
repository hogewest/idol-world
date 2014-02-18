angular.module('app', [])

.value('AppConfig', {
  SPREADSHEET_KEY: "0AiYLrpOi8EdddGJtdTZyQm9MdUtvamxiNll2bUtTeGc",
  BASE_URL: "http://spreadsheets.google.com/ccc?key="
})

.factory('Utils', function() {
  return {
    mappingToIdol: function(rows) {
      var idols = [];
      $.each(rows, function(index, row){
        idol = {
          first_day: row.c[0].v == '○',
          second_day: row.c[1].v == '○',
          affiliation: row.c[2].v,
          name: row.c[3].v,
          link: row.c[16].v,
          character: row.c[4].v,
          character_link: row.c[18].v,
          attribute: row.c[5].v,
          color: row.c[6].v,
          style: row.c[6].p.style.replace("font-family:Dialog;", ""),
          nickname: row.c[7].v,
          song: row.c[8].v,
          call_song: row.c[9].v,
          call_link: row.c[14].v,
          song_link: row.c[11].v,
          remark: row.c[12].v
        };
        idols.push(idol);
      });
      return idols;
    }
  };
})

.filter('partition', function($cacheFactory) {
  var arrayCache = $cacheFactory('partition')

  return function(array, size) {
    if(!Array.isArray(array) || size <= 1) {
      return array;
    }

    var parts   = [],
        jsonArr = JSON.stringify(array);

    for(var i = 0; i < array.length; i += size) {
        parts.push(array.slice(i, i + size));
    }

    var cachedParts = arrayCache.get(jsonArr);
    if (JSON.stringify(cachedParts) === JSON.stringify(parts)) {
      return cachedParts;
    }

    arrayCache.put(jsonArr, parts);
    return parts;
  };
})

.factory('Query', function(AppConfig) {
  var url = AppConfig.BASE_URL + AppConfig.SPREADSHEET_KEY + "&gid=0";
  return new google.visualization.Query(url);
})

.controller('IdolCtrl', function($scope, Utils, Query) {
  Query.send(function(response) {
    var dataTable = JSON.parse(response.getDataTable().toJSON());
    $scope.$apply(function() {
      $scope.idols = Utils.mappingToIdol(dataTable.rows.slice(1));
    });
  });
});
