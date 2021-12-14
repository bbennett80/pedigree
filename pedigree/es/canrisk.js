
var RESULT = {DATE_TODAY: moment()};
$(document).ready(function () {
	RESULT.START_DATE_DOB = moment([(RESULT.DATE_TODAY.year() - CONSTS.DOB_AGE_MAX ), (RESULT.DATE_TODAY.month()), RESULT.DATE_TODAY.date()]);
	RESULT.END_DATE_DOB = moment([(RESULT.DATE_TODAY.year() - CONSTS.DOB_AGE_MIN ), (RESULT.DATE_TODAY.month()), RESULT.DATE_TODAY.date()]);
	RESULT.DOB_AGE = Math.floor((CONSTS.DOB_AGE_MAX-CONSTS.DOB_AGE_MIN)/2 );
	RESULT.DOB_DEFAULT = moment(  [(RESULT.DATE_TODAY.year() - RESULT.DOB_AGE ), (RESULT.DATE_TODAY.month()) , RESULT.DATE_TODAY.date() ]);
	RESULT.DOB_YEAR = RESULT.DOB_DEFAULT.year();
	// Data Used for age for child birth
	RESULT.MENARCHE_AGE = Math.floor(CONSTS.MENARCHE_AGE_MIN);
	RESULT.MENOPAUSE_AGE = CONSTS.DOB_AGE_MAX;

	RESULT.DOB_DATE =  RESULT.DOB_DEFAULT; 	// entered by user
	RESULT.CURRENT_SECTION = 0;    			// last section clicked
	RESULT.FLAG_FAMILY_MODAL = false;    	// flag for has the family modal been shown?
	RESULT.CHILD_DATA_ARRAY = [];
	RESULT.AGE_FIRST_BIRTH = 1000;
	RESULT.YEAR_FIRST_BIRTH = 8000;
	RESULT.INDEX_FIRST_BIRTH = 8000;
	RESULT.ALCOH_UNIT_CALC = "";
	RESULT.grams_per_unit = CONSTS.UNITS_GRAMS_ALCOHOLUK;

	RESULT.REMOVE_OVARIES_BOTH = false;      // both ovaries removed
	RESULT.REMOVE_BREAST_BOTH = false;       // both breasts removed

	$("#qtabs").tabs();
	$("label, span.fa-stack, span.fa-lock").tooltip({
	      content: function () {
	        return $(this).prop('title');
	      },
	      show: {
	        delay: 800,
	        duration: 0
	      },
	      close: function (event, ui) {
	        ui.tooltip.hover(
	          function () {
	            $(this).stop(true).fadeTo(400, 1);
	          },
	          function () {
	            $(this).fadeOut("400", function () {
	              $(this).remove();
	            });
	          }
	        )
	      }
	});
	setup_acc();
});

//--------------------------------------------------------//
//  Check user preference for units & country			  //
//--------------------------------------------------------//
function check_user_preferences() {
	var uwgt = localStorage.getItem("USERS_WGT_UNITS");
	var uhgt = localStorage.getItem("USERS_HGT_UNITS");
	var ucountry = localStorage.getItem("COUNTRY");
	var custom_mut_sensitivities = localStorage.getItem("CUSTOM_SENSITIVITIES");
	var disable_age_yob_sync = localStorage.getItem("DISABLE_SYNC_AGE_YOB");

	if(uwgt === 'IMPERIAL') {
		if(!$("#toggle_weight_units").is(":checked"))
			$('#toggle_weight_units').bootstrapToggle('on').change();
		$('#upref_wgt_imperial').prop('checked', true);
	} else {
		if($("#toggle_weight_units").is(":checked"))
			$('#toggle_weight_units').bootstrapToggle('off').change();
		$('#upref_wgt_metric').prop('checked', true);
	}

	if(uhgt === 'IMPERIAL') {
		if(!$("#toggle_height_units").is(":checked"))
			$('#toggle_height_units').bootstrapToggle('on').change();
		$('#upref_hgt_imperial').prop('checked', true);
	} else {
		if($("#toggle_height_units").is(":checked"))
			$('#toggle_height_units').bootstrapToggle('off').change();
		$('#upref_hgt_metric').prop('checked', true);
	}

	if(ucountry) {
		$("#select_nationality").val(ucountry).selectpicker('refresh').change();
		$('#upref_country').val(ucountry).change();
	}

	$('input#id_use_custom_mutation_sensitivities').prop("checked", custom_mut_sensitivities).change();
	$('input#uprefs_custom_mutation_sensitivities').prop("checked", custom_mut_sensitivities).change();
	if(custom_mut_sensitivities) {
		var sensitivities = JSON.parse(custom_mut_sensitivities);
		$.each(sensitivities, function(gene, value) {
			// set values from default custom settings in user preferences and advanced options
			$('[id^="id_'+gene+'_bc_mut_sensitivity"]').val(value);
			$('[id^="id_'+gene+'_oc_mut_sensitivity"]').val(value);
		});
	}

	if(disable_age_yob_sync) {
		$('#uprefs_disable_age_yob_sync').prop('checked', true);
	}

	if(localStorage.getItem("CALC_10YR_BC_RISKS")) {
		$('#calc_10yr_risks').prop('checked', true);
	}
}

//--------------------------------------------------------//
//  Desc:                                                 //
//     Flag to check for entered locale in local storage  //
//--------------------------------------------------------//
function check_nationatity_flag() {
	var locale = localStorage.getItem(RISK_FACTOR_STR.GLOBAL_DEFAULT_LOCAL);
	if (typeof (locale) !== 'undefined' && (locale) !== null){
		RESULT.GLOBAL_LOCALE = locale;
		console.log("GLOBAL_LOCALE:"+ locale);
	} else {
		RESULT.GLOBAL_LOCALE = "en-gb";
		localStorage.setItem(RISK_FACTOR_STR.GLOBAL_DEFAULT_LOCAL, RESULT.GLOBAL_LOCALE);
	}
	moment.locale(RESULT.GLOBAL_LOCALE);
}

//--------------------------------------------------------//
//  Desc: intialise div's to be hidden                    //
//--------------------------------------------------------//
function set_hidden_div() {
	var divsToHide = [
		"acc_PerInf_tick","acc_Lifestyle_tick","acc_Womhealth_tick","acc_Child_tick","acc_Mamogram_tick","acc_MedHist_tick","acc_Gentests_tick","acc_FamHist_tick",
		"ValidSEX_tick","ValidDOB_tick",
		"h_imperial","w_imperial","spanSTLB1","spanSTLB2","Q2_1_col_div",
		"Q3_2_1_div","Q3_3_1_div","Q3_4_div","Q3_4_2_a_div","Q4_3_col_div", "A3_4_3_HrtBrands_DIV", "childTablerow_DUMMY_",
		"Q4_1_a_div", "vcf_upload", "enterprs",
		"Q5_1_div", "Q5_1_diva", "Q5_1_2div", "Q5_1_3div" ,
		"A6_4_1_div","A6_4_2_div","A6_4_3_div","A6_4_4_div","A6_4_5_div","A6_4_6_div","A6_4_7_div",
		"A6_3_1_1_div","A6_3_1_2_div","A6_3_1_3_div","A6_3_1_4_div",
		"A8_1_div","A8_1_1_div","vcf_div","lb1_div",
		"run", "lnkExtSitediv", "UsageSitediv"];
	for (var j=0; j < divsToHide.length; j++) {
		$("#" + divsToHide[j]).hide();
	}
}

//--------------------------------------------------------//
function currentSection(title) {
	if(title == $("#acc_PerInf_title").text()){
		return 0;
	} else if(title == $("#acc_Lifestyle_title").text()){
		return 1;
	} else if(title == $("#acc_Womhealth_title").text()){
		return 2;
	} else if(title == $("#acc_Child_title").text()){
		return 3;
	} else if(title == $("#acc_Mamogram_title").text()){
		return 4;
	} else if(title == $("#acc_MedHist_title").text()){
		return 5;
	} else  if(title == $("#acc_Gentests_title").text()){
		return 6;
	} else  if(title == $("#acc_FamHist_title").text()){
		return 7;
	}
	return 0;
}

//-----------------------------------------------------------//
//  Leaving FH section                                       //
//-----------------------------------------------------------//
function acc_FamHist_Leave() {
	var ds = pedcache.current(opts);
	var proband =  ds[ pedigree_util.getProbandIndex(ds) ]
	if(!proband) {
		console.error("no proband");
		pedigree_util.messages("Error", "No proband selected!");
		return;
	}
	sync_from_FamHist();
}

function sync_from_FamHist() {
	var ds = pedcache.current(opts);
	var proband =  ds[ pedigree_util.getProbandIndex(ds) ]
	if(!proband) {
		pedigree_util.messages("Error", "No proband selected!");
		return;
	}
	acc_PerInf_sync();
	acc_MedHist_sync();			// sync cancer diagnosis age
	if(proband.sex !== 'M') acc_Child_sync();			// sync children section
}

//-----------------------------------------------------------//
//  Entering FH section                                      //
//-----------------------------------------------------------//
function acc_FamHist_Enter() {
	acc_FamHist_ticked();
}

//  remove tick from section title
function acc_FamHist_unticked(){
	$("#acc_FamHist_title").removeClass("ticked");
	$("#acc_FamHist_tick").hide();
}

function acc_FamHist_ticked(){
	$("#acc_FamHist_title").addClass("ticked");
	$("#acc_FamHist_tick").show();
}

//  Called on accordion section leave event
function section_leave() {
	switch (RESULT.CURRENT_SECTION) {
	    case 0:
	    	acc_PerInf_Leave();
	        break;
	    case 1:
	    	acc_Lifestyle_Leave();
	        break;
	    case 2:
	    	acc_Womhealth_Leave();
	        break;
	    case 3:
	    	acc_Child_Leave();
	        break;
	    case 4:
	    	acc_BreastScreen_Leave();
	        break;
	    case 5:
	    	acc_MedHist1_Leave();
	        break;
	    case 6:
	    	acc_Gentests_Leave();
	    	break;
	    case 7:
	    	acc_FamHist_Leave();
	    	break;
	}
}

//  Set up items in accordion
function setup_acc() {
	var $accordion = $("#Mainaccordion").accordion({
		active: "false",
		heightStyle: "content",
		collapsible: true,
		header: "h3",
	});

	if(!pedigree_util.isIE()) {
		console.log("NOT IE");
		jQuery.fn.d3Click = function () {	// used to click d3 nodes
			  this.each(function (i, e) {
			    var evt = new MouseEvent("click");
			    e.dispatchEvent(evt);
			  });
			};
	}

	$("#Mainaccordion").on("accordionbeforeactivate", function (event, ui) {
		 if(ui.newHeader){
			section_leave();
			RESULT.CURRENT_SECTION = currentSection(ui.newHeader.closest( "h3" ).text());
			switch (RESULT.CURRENT_SECTION) {
			    case 2:			// women's health
			    	acc_Womhealth_Enter();
			        break;
			    case 3:			// children
			    	acc_Child_Enter();
			        break;
			    case 6:			// genetic tests
			    	acc_Gentests_Enter();
			    	break;
			    case 7:			// family history
			    	acc_FamHist_Enter();
					if(!RESULT.FLAG_FAMILY_MODAL){
						var ds = pedcache.current(opts);
						var proband =  ds[ pedigree_util.getProbandIndex(ds) ]
						if(!pedigree_util.isIE() && proband && 'name' in proband) {
							$('#'+proband.name).parent().d3Click();  // initialise with proband
						}
						$('#fam-init-dialog').modal();
						RESULT.FLAG_FAMILY_MODAL = true;
					}
			    	break;
			}
		 }
	});

	// call section leave when entering calculate button div
	$('#CalculateBTNs_Div').on('mouseenter', function() {
		section_leave();
	});

	// update risk factors when canrisk file is loaded
	$(document).on('riskfactorChange', function(e, opts, risk_factors){
		reset_n_sync(opts, risk_factors);
    });

	personal_init();
	lifestyle_init();
	womenhealth_init();
	children_init();
	breastscreen_init();
	medhist_init();
	gentest_init();

	bindSpinners();
    set_hidden_div();

    $('input[type=radio][name=origin]').on('change', function() {
        switch(this.id) {
            case 'orig_ashk':
            	$('#id_mutation_frequencies').val('Ashkenazi').change();
            break;
            case 'orig_unk':
            	$('#id_mutation_frequencies').val('UK').change();
            break;
        }
        pedigree_form.save_ashkn(opts);
    });

	$("#lnkExtSiteBTN").click(function () {
		$("#lnkExtSitediv").toggle();
	});

	check_user_preferences();
	check_nationatity_flag();

	$("#Mainaccordion").accordion({active:0, icons:false});
}

$("#resetBTN").click(function() {
	location.reload(true);
});

$('#user_prefs').click(function() {
	var role = localStorage.getItem(RISK_FACTOR_STR.GLOBAL_SCREENING);
	var $radios = $('input:radio[name=myrole]');
    $radios.filter('[value="'+role+'"]').prop('checked', true); 	// select current role

    if($.fn.ihavecookies.preference("preferences")) {
		$("#UserPreferences").modal("show");
    } else {
    	pedigree_util.messages("Storage Permission", "Web browser storage for setting user preferences has not been granted.");
    }
});

// event when user pref dialog closed updates custom gene test sensitivities
$("#UserPreferences" ).on( "hidden.bs.modal", function( event, ui ) {
	var use_custom = $("#uprefs_custom_mutation_sensitivities").prop("checked");
	if(use_custom) {
		var sensitivities = {};
		$("[id$='_mut_sensitivity_default']").each(function(i) {
			var gene = this.id.match(/id_(.*)_[o|b]c_mut_sensitivity_default/)[1];
			sensitivities[gene] = $(this).val();
		});
		localStorage.setItem("CUSTOM_SENSITIVITIES", JSON.stringify(sensitivities));
	} else {
		localStorage.removeItem("CUSTOM_SENSITIVITIES");
	}

	if($("#uprefs_disable_age_yob_sync").prop("checked")) {
		localStorage.setItem("DISABLE_SYNC_AGE_YOB", true);

	} else {
		localStorage.removeItem("DISABLE_SYNC_AGE_YOB");
	}

	if($("#calc_10yr_risks").prop("checked")) {
		localStorage.setItem("CALC_10YR_BC_RISKS", true);

	} else {
		localStorage.removeItem("CALC_10YR_BC_RISKS");
	}
	check_user_preferences();
});

// show/hide advanced options in user preferences
$("#upref_advanced_btn").click(function(){
    $("#upref_advanced").toggleClass("hidden");
    $("#upref_advanced_btn > i").toggleClass("fa-caret-down fa-caret-up");
});

// enable/disable cutom sensitivities & reset defaults on disable
$('#uprefs_custom_mutation_sensitivities').change(function(){
	if(!$(this).prop("checked")){
		$("[id$='_mut_sensitivity_default']").each(function(){
			  $(this).val( $(this).prop("defaultValue") );
		});
	}
	$("[id$='_mut_sensitivity_default']").prop('disabled', !$(this).prop("checked"));
});

// BRCA1/2 sensitivities need to be same for breast & ovarian models
$('[id$="_mut_sensitivity_default"]').on('keyup mouseup', function() {
	var match = this.id.match(/id_(brca\d)_([o|b]c)_mut_sensitivity_default/)
	if(!match) return;
	var sid = "#id_" + match[1] + "_" + (match[2] === 'bc' ? 'oc' : 'bc') + "_mut_sensitivity_default";
	$(sid).val($(this).val());
});

$('input:radio[name="upref_hgt_units"]').change(function(){
	if(this.id === 'upref_hgt_imperial')
		localStorage.setItem("USERS_HGT_UNITS", 'IMPERIAL');
	else
		localStorage.removeItem("USERS_HGT_UNITS");
	check_user_preferences();
});

$('input:radio[name="upref_wgt_units"]').change(function(){
	if(this.id === 'upref_wgt_imperial')
		localStorage.setItem("USERS_WGT_UNITS", 'IMPERIAL');
	else
		localStorage.removeItem("USERS_WGT_UNITS");
	check_user_preferences();
});

$('#upref_country').change(function(){
	console.log($('#upref_country').val());
	var val = $('#upref_country').val();
	$("#select_nationality").val(val).selectpicker('refresh').change();
	localStorage.setItem("COUNTRY", val);
});

// warn before leaving or reloading page
$(window).on('beforeunload', function(){
	return 'Are you sure you want to leave?';
});
