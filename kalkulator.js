$(document).ready(function(){
  load_emas_perak();

  $( "#accordion" ).accordion();
  $( "#tabs" ).tabs();
//  change_to_formatmoney();

  $('.input_pribadi, #pribadi_hutang').change(function(){
      calculate_pribadi();
      calculate_simpanan();
      calculate_total_zakat();
  });
  
  $('#lembar_saham, #harga_saham, #dividen, #aset_pasif, input[name=jenis_saham]').change(function(){
      calculate_saham();
  });
  
  $('#berat_emas, #berat_perak, #bayar_emas').change(function(){
      calculate_logam();
      calculate_total_zakat();
  });
  
  $('.input_usaha').change(function(){
      calculate_zakat_usaha();
      calculate_total_zakat();
  });

  $('input[type=text]').change(function(){
      var new_val = accounting.formatMoney($(this).val(), { symbol: "",  format: "%v" }); 
      $(this).val(new_val);
  });

});

function load_emas_perak(){
    $.getJSON("https://api.scraperwiki.com/api/1.0/datastore/sqlite?format=jsondict&name=emas_perak&query=select%20*%20from%20%60swdata%60%20limit%2010",function(data){
    $('#harga_emas').val(data[0].emas);
    $('#harga_perak').val(data[0].perak);
    var nisab = 85*parseInt($('#harga_emas').val());
    $('#nisab').val(nisab);
    change_to_formatmoney();
});
}


function change_to_formatmoney(){
  $('input[type=text]').each(function(){
      var new_val = accounting.formatMoney($(this).val(), { symbol: "",  format: "%v" }); 
      $(this).val(new_val);
  });
}

function calculate_pribadi(){
  var sum = 0;
  $('.input_pribadi').each(function(){
      sum+=parseInt(accounting.unformat($(this).val()));   
  });
  $('#pribadi_jumlah').val(accounting.formatMoney(sum, { symbol: "",  format: "%v" }));
}

function calculate_logam(){
    var brt_emas = parseInt(accounting.unformat($('#berat_emas').val()));
    var brt_perak = parseInt(accounting.unformat($('#berat_perak').val()));
    var harga_emas = parseInt(accounting.unformat($('#harga_emas').val()))
    var harga_perak = parseInt(accounting.unformat($('#harga_perak').val()))
    if (brt_emas >= 85) var ze = brt_emas*2.5/100;
    else ze = 0;
    $('#zakat_emas_gram').val(ze);
    $('#zakat_emas_uang').val(accounting.formatMoney(harga_emas*ze, { symbol: "",  format: "%v" }));
    if (brt_perak >= 595) var zp = brt_perak*2.5/100;
    else zp = 0;
    $('#zakat_perak_gram').val(zp);
    $('#zakat_perak_uang').val(accounting.formatMoney(harga_perak*zp, { symbol: "",  format: "%v" }));
    $('#jumlah_emas').val(accounting.formatMoney((harga_emas*ze)+(harga_perak*zp), { symbol: "",  format: "%v" }));
}

function calculate_saham(){
  var saham=0;
  var lembar = parseInt(accounting.unformat($('#lembar_saham').val()));
  var harga = parseInt(accounting.unformat($('#harga_saham').val()));
  var aset = parseInt(accounting.unformat($('#aset_pasif').val()));
  var dividen = parseInt(accounting.unformat($('#dividen').val()));
  var jenis = $('input[name=jenis_saham]:checked').val()
  if (jenis=="dagang") saham = lembar*harga;
  else if (jenis=="jasa") saham = dividen;
  else if (jenis=="produksi") saham = lembar*harga-aset;
  $('#pribadi_saham').val(accounting.formatMoney(saham, { symbol: "",  format: "%v" }));
  calculate_pribadi();
  calculate_simpanan();
}

function calculate_simpanan(){
  var hutang = parseInt(accounting.unformat($('#pribadi_hutang').val()));
  var total_simpanan = parseInt(accounting.unformat($('#pribadi_jumlah').val()));
  var nisab = parseInt(accounting.unformat($('#nisab').val()));
  var sisa_simpanan = total_simpanan-hutang
  if(sisa_simpanan >= nisab){
    var pribadi_harta_zakat = sisa_simpanan;
  }else{
    var pribadi_harta_zakat = 0;
  }
  $('#pribadi_harta_zakat').val(accounting.formatMoney(pribadi_harta_zakat, { symbol: "",  format: "%v" }));
  var pribadi_zakat = 2.5/100*pribadi_harta_zakat;
  $('#pribadi_zakat').val(accounting.formatMoney(pribadi_zakat, { symbol: "",  format: "%v" }));
}

function calculate_zakat_usaha(){
    var perusahaan_nilai = parseInt(accounting.unformat($('#perusahaan_nilai').val()));
    var perusahaan_utang = parseInt(accounting.unformat($('#perusahaan_utang').val()));
    var perusahaan_prosentase = parseInt(accounting.unformat($('#perusahaan_prosentase').val()));
    var perusahaan_bersih_usaha = perusahaan_prosentase*(perusahaan_nilai-perusahaan_utang)/100;
    $('#perusahaan_bersih_usaha').val(accounting.formatMoney(perusahaan_bersih_usaha, { symbol: "",  format: "%v" }));
    var nisab = parseInt(accounting.unformat($('#nisab').val()));
    if(perusahaan_bersih_usaha >= nisab){
      perusahaan_harta_zakat = perusahaan_bersih_usaha;
    }else{
      perusahaan_harta_zakat = 0;
    }
    $('#perusahaan_harta_zakat').val(accounting.formatMoney(perusahaan_harta_zakat, { symbol: "",  format: "%v" }));   
    var perusahaan_zakat = 2.5/100*perusahaan_harta_zakat;
    $('#perusahaan_zakat').val(accounting.formatMoney(perusahaan_zakat, { symbol: "",  format: "%v" }));   
}

function calculate_total_zakat(){
   var logam_zakat = 0;
   if ($('#bayar_emas').is(":checked")) logam_zakat = parseInt(accounting.unformat($('#jumlah_emas').val()));  
   var perusahaan_zakat = parseInt(accounting.unformat($('#perusahaan_zakat').val())); 
   var pribadi_zakat = parseInt(accounting.unformat($('#pribadi_zakat').val())); 
   var total_zakat = logam_zakat + pribadi_zakat + perusahaan_zakat;
   $('#total_zakat').val(accounting.formatMoney(total_zakat, { symbol: "",  format: "%v" }));   
}
