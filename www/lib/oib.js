(function () {
  const OIB_ELEMENTS = {
  INPUT: {
    BUTTON: 'oib-input-button',
    CHECKBOX: 'oib-input-checkbox',
    COLOR: 'oib-input-color',
    DATE: 'oib-input-date',
    DATETIME: 'oib-input-datetime',
    DATETIMELOCAL: 'oib-input-datetime-local',
    EMAIL: 'oib-input-email',
    FILE: 'oib-input-file',
    MONTH: 'oib-input-month',
    NUMBER: 'oib-input-number',
    PASSWORD: 'oib-input-password',
    RADIO: 'oib-input-radio-group',
    RANGE: 'oib-input-range',
    RESET: 'oib-input-reset',
    SEARCH: 'oib-input-search',
    SUBMIT: 'oib-input-submit',
    TEL: 'oib-input-tel',
    TEXT: 'oib-input-text',
    TIME: 'oib-input-time',
    URL: 'oib-input-url',
    WEEK: 'oib-input-week'
  },
  CHILDREN: {
    RADIO: 'oib-input-radio'
  },
  CUSTOM_HTML: {
    RADIO: 'oib-input-radio-group'
  },
  DISPLAY: {
    LABEL: 'oib-label'
  }
};
const OIB_DATA_ATTRS = {
  POSITION: {
    PAGE_NUMBER: 'data-oib-page-number',
    SEQUENCE: 'data-oib-sequence'
  },
  // Should be specified if some other element is to be converted to radio
  RADIO: {
    NAME: 'data-oib-radio-name',
    VALUE: 'data-oib-radio-value'
  },
  DISPLAY: {
    LABEL: 'data-oib-label'
  }
}
const OIB = {
  currentElementToShow: null,
  currentElementToHide: null,
  // add capabilities...
  initialize: function (elementToHide, elementToShow) {
    console.log('OIB INITIALIZED' + '#'+ elementToHide + ' > [' + OIB_DATA_ATTRS.POSITION.PAGE_NUMBER+ ']');

    // Get all elements with attribute data-oib-page-number
    var allElements = [].slice.call(document.getElementById(elementToHide).querySelectorAll('[' + OIB_DATA_ATTRS.POSITION.PAGE_NUMBER+ ']'));
    // Sort by page number
    allElements = allElements.sort(function (a, b) {
      if (!isNaN(Number(a.getAttribute(OIB_DATA_ATTRS.POSITION.PAGE_NUMBER))) && !isNaN(Number(b.getAttribute(OIB_DATA_ATTRS.POSITION.PAGE_NUMBER)))) {
        return Number(a.getAttribute(OIB_DATA_ATTRS.POSITION.PAGE_NUMBER)) - Number(b.getAttribute(OIB_DATA_ATTRS.POSITION.PAGE_NUMBER));
      }
      return 0;
    });
    const pageMap = {};
    // Create map of elements by page number
    allElements.forEach((element) => {
      if (!pageMap[element.getAttribute(OIB_DATA_ATTRS.POSITION.PAGE_NUMBER)]) {
        pageMap[element.getAttribute(OIB_DATA_ATTRS.POSITION.PAGE_NUMBER)] = [];
      }
      pageMap[element.getAttribute(OIB_DATA_ATTRS.POSITION.PAGE_NUMBER)].push(element);
    });
    // Sort elements in each page by sequence number if present
    for (var page in pageMap) {
      let pageElements = pageMap[page];
      if (pageElements.length > 1) {
        pageElements = pageElements.sort(function (a, b) {
          if (!isNaN(Number(a.getAttribute(OIB_DATA_ATTRS.POSITION.SEQUENCE))) && !isNaN(Number(b.getAttribute(OIB_DATA_ATTRS.POSITION.SEQUENCE)))) {
            return Number(a.getAttribute(OIB_DATA_ATTRS.POSITION.SEQUENCE)) - Number(b.getAttribute(OIB_DATA_ATTRS.POSITION.SEQUENCE));
          }
          return 0;
        });
      }
    };
    // const labelElementList = [];
    // for (var i in allElements) {
    //   const label = parentLabelElements[i];
    //   const element = allElements[i];
    //   labelElementList.push({
    //     label: label,
    //     element: element
    //   });
    // }
    // .filter(function (el) {
    //     return (!isNaN(Number(el.getAttribute('data-oib-sequence'))))
    // })

    let htmlString = '<form id="regForm">';
    for (var i in pageMap) {
      htmlString += '<div class="tab">';
      for (var j = 0; j < pageMap[i].length; j++) {
        const element = pageMap[i][j];
        if (element.className.indexOf(OIB_ELEMENTS.CUSTOM_HTML.RADIO) !== -1) {
          htmlString += this.getRadioGroup([].slice.call(element.children), element.dataset.oibRadioName);
        } else if (element.className.indexOf(OIB_ELEMENTS.DISPLAY.LABEL) !== -1 || element.dataset.oibLabel ) {
          htmlString += this.getLabel(element);
        }else {
          htmlString += this.appendOIBClasses(element).outerHTML;
        }
      }
      htmlString += '</div>';
    }
    htmlString += `<div class="oib-action-buttons">
                        <div style="float:right; padding: 10px;">
                          <button type="button" id="prevBtn" onclick="javascript:OIB.nextPrev(-1)" class="oib-primary-button">Previous</button>
                          <button type="button" id="nextBtn" onclick="javascript:OIB.nextPrev(1)" class="oib-primary-button">Next</button>
                            </div>
                        </div>
                        <!-- Circles which indicates the steps of the form: -->
                        <div class="oib-footer-steps">
                            <span class="step"></span>
                            <span class="step"></span>
                            <span class="step"></span>
                            <span class="step"></span>
                        </div>
                        </form>`
    var elmntToHide = document.getElementById(elementToHide);
    this.currentElementToHide = elmntToHide;
    elmntToHide.style.display = 'none';
    var elmntToShow = document.getElementById(elementToShow);
    this.currentElementToShow = elmntToShow
    elmntToShow.innerHTML = htmlString;
    elmntToShow.style.display = 'block';
    elmntToShow.className += ' notransition';
    elmntToShow.removeAttribute('hidden');
    var currentTab = 0; // Current tab is set to be the first tab (0)
    this.showTab(currentTab); // Display the crurrent tab
    return htmlString;
  },
  nextPrev: function(n) {
    // This function will figure out which tab to display
    var x = document.getElementsByClassName("tab");
    // Exit the function if any field in the current tab is invalid:
    // if (n == 1 && !validateForm()) return false;
    // Hide the current tab:
    x[this.currentTab].style.display = "none";
    // Increase or decrease the current tab by 1:
    this.currentTab = this.currentTab + n;
    // if you have reached the end of the form...
    if (this.currentTab >= x.length) {
      // ... the form gets submitted:
      document.getElementById("regForm").submit();
      return false;
    }
    // Otherwise, display the correct tab:
    this.showTab(this.currentTab);
  },
  showTab: function(n) {
    this.currentTab = n;
    // This function will display the specified tab of the form...
    var x = this.currentElementToShow.getElementsByClassName("tab");
    for (var i =0; i < x.length; i++) {
      x[i].style.display = 'none';
    }
    x[n].style.display = "block";
    //... and fix the Previous/Next buttons:
    if (n == 0) {
      document.getElementById("prevBtn").style.display = "none";
    } else {
      document.getElementById("prevBtn").style.display = "inline";
    }
    if (n == (x.length - 1)) {
      document.getElementById("nextBtn").innerHTML = "Submit";
    } else {
      document.getElementById("nextBtn").innerHTML = "Next";
    }
    //... and run a function that will display the correct step indicator:
    this.fixStepIndicator(n)
  },
  fixStepIndicator: function(n) {
    // This function removes the "active" class of all steps...
    var i, x = document.getElementsByClassName("step");
    for (i = 0; i < x.length; i++) {
      x[i].className = x[i].className.replace(" active", "");
    }
    //... and adds the "active" class on the current step:
    x[n].className += " active";
  },
  exitOIB: function(oibElementId, defaultElementId) {
    const oibElement = document.getElementById(oibElementId);
    oibElement.style.display = "block";
    const defaultElement = document.getElementById(defaultElementId);
    defaultElement.style.display = "none";
  },
  getRadioGroup: function(radioElements, name) {
    // radioElements = radioElements.sort(function (a, b) {
    //   if (!isNaN(Number(a.getAttribute('data-oib-sequence'))) && !isNaN(Number(b.getAttribute('data-oib-sequence')))) {
    //     return Number(a.getAttribute('data-oib-sequence')) - Number(b.getAttribute('data-oib-sequence'));
    //   }
    //   return 0;
    // });
    let radios = [];
    let labels = [];
    for (var i in radioElements) {
      if (radioElements[i].className.indexOf(OIB_ELEMENTS.CHILDREN.RADIO) !== -1 ) {
        radios.push(radioElements[i]);
      }
      if ( radioElements[i].className.indexOf(OIB_ELEMENTS.DISPLAY.LABEL) !== -1 || radioElements[i].dataset.oibLabel ) {
        labels.push(radioElements[i]);
      }
    }
    // radios = radios.sort(function (a, b) {
    //   if (!isNaN(Number(a.getAttribute('data-oib-sequence'))) && !isNaN(Number(b.getAttribute('data-oib-sequence')))) {
    //     return Number(a.getAttribute('data-oib-sequence')) - Number(b.getAttribute('data-oib-sequence'));
    //   }
    //   return 0;
    // });
    // labels = labels.sort(function (a, b) {
    //   if (!isNaN(Number(a.getAttribute('data-oib-sequence'))) && !isNaN(Number(b.getAttribute('data-oib-sequence')))) {
    //     return Number(a.getAttribute('data-oib-sequence')) - Number(b.getAttribute('data-oib-sequence'));
    //   }
    //   return 0;
    // });
    let radioStr = '';
    for (var i in radios) {
      // Grab the original element
      var original    = radios[i];
      // Create a replacement tag of the desired type
      var replacement = document.createElement('input');

      // Grab all of the original's attributes, and pass them to the replacement
      for(var j = 0, l = original.attributes.length; j < l; ++j){
          var nodeName  = original.attributes.item(j).nodeName;
          var nodeValue = original.attributes.item(j).nodeValue;
          replacement.setAttribute(nodeName, nodeValue);
      }
      replacement.className = replacement.className.replace('ui-btn', '');
      replacement.className = replacement.className.replace('ui-shadow', '');
      replacement.className = replacement.className.replace('ui-corner-all', '');
      replacement.className += ' oib-mode-radio';
      replacement.name = name;
      replacement.value = radios[i].dataset.oibRadioValue;
      replacement.type = "radio";
      // Persist contents
      replacement.innerHTML = original.innerHTML;
      
      radioStr += '<div class="row oib-radio-row"><div class="oib-radio-wrapper">' + replacement.outerHTML +' </div><div class="col-8">'+ this.getLabel(labels[i], true) +'</div></div>'
    }
    return radioStr;
  },
  getLabel: function(labelElement, isChild) {
    let labelStr = '';
    let labelClass = '';
    if (labelElement.dataset.oibLabel) {
      labelStr = labelElement.dataset.oibLabel;
    } else {
      labelStr = labelElement.innerHTML;
    }
    if (isChild) {
      labelClass = 'oib-mode-label';
    } else {
      labelClass = 'oib-mode-heading';
    }
    // TODO: Add remaining attributes to the element
    return '<label class="' + labelClass +'">' + labelStr + '</label>'
  },
  appendOIBClasses: function(element) {
    element.className += " oib-mode";
    return element;
  },
  currentTab: 0
};


function validateForm() {
  // This function deals with validation of the form fields
  var x, y, i, valid = true;
  x = document.getElementsByClassName("tab");
  y = x[currentTab].getElementsByTagName("input");
  // A loop that checks every input field in the current tab:
  for (i = 0; i < y.length; i++) {
    // If a field is empty...
    if (y[i].value == "") {
      // add an "invalid" class to the field:
      y[i].className += " invalid";
      // and set the current valid status to false
      valid = false;
    }
  }
  // If the valid status is true, mark the step as finished and valid:
  if (valid) {
    document.getElementsByClassName("step")[currentTab].className += " finish";
  }
  return valid; // return the valid status
}
window.OIB = OIB;
})();

// define('OIB', function(){
//   var oib = {};
// 	// add capabilities...
//   oib.initialize = function () {
//     console.log('OIB INITIALIZED');
//     var labelElements = document.querySelectorAll('[class*="oib-label"]');
//     var inputElements = document.querySelectorAll('[class*="oib-input"]');
//     // var buttonElements = document.querySelectorAll('[class*="oib-button"]');
//     var allElemnts = [].concat(labelElements, inputElements);
//     allElemnts = allElemnts.sort(function (a, b) {
//       if (!isNaN(Number(a.getAttribute('data-oib-sequence'))) && !isNaN(Number(b.getAttribute('data-oib-sequence')))) {
//         return a - b
//       }
//     });
//     // .filter(function (el) {
//     //     return (!isNaN(Number(el.getAttribute('data-oib-sequence'))))
//     // })

//     const htmlString = '<form id="regForm">';
//     for (var i in allElemnts) {
//       htmlString += '<div class="tab">';
//       htmlString += allElemnts[i];
//       htmlString += '</div>';
//     }
//     htmlString += `<div style="overflow:auto;">
//                         <div style="float:right;">
//                         <button type="button" id="prevBtn" onclick="nextPrev(-1)">Previous</button>
//                             <button type="button" id="nextBtn" onclick="nextPrev(1)">Next</button>
//                             </div>
//                         </div>
//                         <!-- Circles which indicates the steps of the form: -->
//                         <div style="text-align:center;margin-top:40px;">
//                             <span class="step"></span>
//                             <span class="step"></span>
//                             <span class="step"></span>
//                             <span class="step"></span>
//                         </div>
//                         </form>`
//     var body = document.getElementsByTagName("body")[0];
//     body.innerHTML = htmlString;
//     // var currentTab = 0; // Current tab is set to be the first tab (0)
//     // showTab(currentTab); // Display the crurrent tab
//   }
// 	return oib;
// });
// if (typeof module !== "undefined" && module.exports) {
//   module.exports.IOB = IOB;
// } else if ((typeof define !== "undefined" && define !== null) && (define.amd !== null)) {
//   define("OIB", function() {
//     return IOB;
//   });
// }