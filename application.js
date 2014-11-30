function Dog(){
  var r = {};
  var list = ['b', 'p', 'pd', 's', 'c', 't', 'w', 'r'];
  for(var i in list){
    r[list[i]] = '0';
  }
  return r;
}

function cart_to_name(a){
  var ret = [];
  for(var i = 0; i<=15; i+=2){
    if(a[i + 1].toUpperCase() === a[i + 1]){
      ret.push(a[i+1]+a[i]);
    }else{
      ret.push(a[i]+a[i+1]);
    }
  }
  return ret.join('-');
}

function cartesian() {
    var r = [], arg = arguments, max = arg.length-1;
    function helper(arr, i) {
        for (var j=0, l=arg[i].length; j<l; j++) {
            var a = arr.slice(0); // clone arr
            a.push(arg[i][j]);
            if(i===max){
                r.push(a);
            }else{
                helper(a, i+1);
            }
        }
    }
    helper([], 0);
    return r;
}

function GeneCtrl($scope){ // jshint ignore:line
  $scope.by_name = {};
  $scope.male = {};
  $scope.female = {};
  $scope.genes = ['b', 'p', 'pd', 's', 'c', 't', 'w', 'r'];
  $scope.gene_name = {
    s:  'серебристый',
    c:  'осветленный',
    w:  'белый',
    b:  'синеголовый',
    p:  'золотой жемчуг',
    r:  'красногрудый',
    pd:  'пестрый',
    t: 'смокинг'};
  $scope.gene_variants = {
    b: { 0: 'нет', 1: 'есть', 2: 'двухфакторный' },
    pd: { 0: 'нет', 1: 'есть', 2: 'двухфакторный' },
    p: { 0: 'нет', 1: 'есть' },

    s: { 0: 'нет', 1: 'носитель', 2: 'есть' },
    c: { 0: 'нет', 1: 'носитель', 2: 'есть' },
    w: { 0: 'нет', 1: 'носитель', 2: 'есть' },
    r: { 0: 'нет', 1: 'носитель', 2: 'есть' },
    t: { 0: 'нет', 1: 'носитель', 2: 'есть' }
  };


  $scope.describe_genome = function(k){
    var ret = [];
    var nos = [];
    var gene, i;
    if(k.indexOf("PP") !== -1){
      ret.push('<span style="color:red">летальные гены</span>');
    }
    if(k.indexOf("WW") !== -1){
      ret.push('<span style="background: black; color:white; padding: 2px 5px; font-weight:bold">Белый цвет завуалирует все остальные окрасы</span>');
    }
    for(i in $scope.recessive){
      gene = $scope.recessive[i];
      if(k.indexOf(gene.toUpperCase() + gene.toUpperCase()) !== -1){
        ret.push($scope.gene_name[gene]);
      }
      if(k.indexOf(gene.toUpperCase() + gene) !== -1){
        nos.push($scope.gene_name[gene]);
      }
    }
    for(i in $scope.dominant){
      gene = $scope.dominant[i];
      if(k.indexOf(gene.toUpperCase() + gene.toUpperCase()) !== -1){
        ret.push($scope.gene_name[gene] + (gene === 'b' ? ' двухфакторный' : ''));
      }
      if(k.indexOf(gene.toUpperCase() + gene) !== -1){
        ret.push($scope.gene_name[gene]);
      }
    }
    if(ret.length === 0){
      ret = 'Природный';
    }else{
      ret = ret.join(', ');
    }
    if(nos.length > 0){
      ret += ('<br><b>Носитель:</b> ' + nos.join(', '));
    }
    return ret;
  };
  $scope.dominant = ['b', 'p', 'pd'];
  $scope.recessive =  ['s', 'c', 't', 'w', 'r'];
  $scope.results = [];
  $scope.by_combo = [];
  $scope.calculate = function(){
    var male = $scope.male;
    var female = $scope.female;

    var data = [];
    for(var ig in $scope.genes){
      var gene = $scope.genes[ig];
      if(male[gene] === '0'){
        data.push([gene, gene]);
      }
      if(male[gene] === '1'){
        data.push([gene.toUpperCase(), gene]);
      }
      if(male[gene] === '2'){
        data.push([gene.toUpperCase(), gene.toUpperCase()]);
      }

      if(female[gene] === '0'){
        data.push([gene, gene]);
      }
      if(female[gene] === '1'){
        data.push([gene.toUpperCase(), gene]);
      }
      if(female[gene] === '2'){
        data.push([gene.toUpperCase(), gene.toUpperCase()]);
      }
    }

    var all = cartesian.apply(this, data);
    var by_name = {};
    for(var iall in all){
      var key = all[iall].join("");
      if(by_name[key]){
        by_name[key].count++;
      }else{
        by_name[key] = {name: cart_to_name(all[iall]), count: 1};
      }
    }

    var by_name_grouped = {};
    for(var i in by_name){
      var group = $scope.describe_genome(by_name[i].name);
      if(by_name_grouped[group]){
        by_name_grouped[group] += (by_name[i].count / 65536 * 100);
      }else{
        by_name_grouped[group] = (by_name[i].count / 65536 * 100);
      }
    }
    $scope.by_name = by_name_grouped;
    $scope.results = all;
    $scope.$broadcast('results');
    $scope.$broadcast('by_name');
  };
  for(var i in $scope.genes){ // jshint ignore:line
    $scope.male = new Dog();
    $scope.female = new Dog();
  }

  $scope.gene_to_string = function(obj){
    var ret = [];
    for(var k in obj){
      if(k !== '$$hashKey'){
        var v = parseInt(obj[k]);
        var t = '';
        if(v === 0){
          t = k + k;
        }
        if(v === 1){
          t = k.toUpperCase() + k;
        }
        if(v === 2){
          t =  k.toUpperCase() + k.toUpperCase();
        }
        ret.push(t);
      }
    }
    return ret.join('-');
  };
}
