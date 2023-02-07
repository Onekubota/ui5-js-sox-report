sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
    "sap/m/MessageToast"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, Filter, FilterOperator, MessageToast) {
        "use strict";

        return Controller.extend("com.ewm.zewmsoxui5.controller.Main", {
            onInit: function () {
                this._oViewCache = new JSONModel({
                    selectedFilterProcess: "",
                    systemUser: "",
                    systemDate: "",
                    systemTime: "",
                    systemId: "",
                    numdlvlines: "",
                    numsameusers: "",
                    pdiffusers: "",
                });
                this.getView().setModel(this._oViewCache, "ViewCache");
                this.oDataModel = this.getOwnerComponent().getModel();
                this.oDataModel.attachRequestCompleted(this.onTableDataReceived,this);
                this._oSmartFilter = this.getView().byId("smartFilterBar");
                this._oSmartTable = this.getView().byId("IdSoxDataTable");
            },

            onBeforeRebindTable: function(oEvent) {
                var mBindingParams = oEvent.getParameter("bindingParams");
                var oSelect = this._oSmartFilter.getControlByKey("Process");
                var processKey = oSelect.getSelectedKey();
                var newFilter = new Filter("Process", FilterOperator.EQ, processKey);
                mBindingParams.filters.push(newFilter);
            },

            onTableDataReceived: function(oEvent) {
                this.oDataModel.setHeaders();
                var headers = oEvent.getParameter("response").headers;
                if (headers.system) {
                    this._oViewCache.setProperty("/systemId", headers.system);
                    this._oViewCache.setProperty("/systemUser", headers.user);
                    this._oViewCache.setProperty("/systemDate", headers.date);
                    this._oViewCache.setProperty("/systemTime", headers.time);                    
                    this._oViewCache.setProperty("/numdlvlines", headers.numdlvlines);                    
                    this._oViewCache.setProperty("/numsameusers", headers.numsameusers);                    
                    this._oViewCache.setProperty("/pdiffusers", headers.pdiffusers);                    
                }
            },

            _onPressExportPDF: function(oEvent) {
                var filterData = this._oSmartFilter.getFilterData();
                var oSelect = this._oSmartFilter.getControlByKey("Process");
                var processKey = oSelect.getSelectedKey();
                var warehouse = filterData.Warehouse;
                var date, dateLow, dateHigh = null;
                if (filterData.CompleteDate) {
                    date = filterData.CompleteDate.ranges[0];
                    dateLow = date.value1;
                    if (date.operation === FilterOperator.BT) {
                        dateHigh = date.value2;
                    } else {
                        dateHigh = dateLow;
                    }                    
                }
                
                if (warehouse === null || processKey === null || dateLow === null) {
                    return;
                }

                var key = this.oDataModel.createKey("/SoxDataPdfSet", {
                    Warehouse: warehouse,
                    Process: processKey,
                    CompleteDateStart: dateLow,
                    CompleteDateEnd: dateHigh
                });

                var messageText = this.getView().getModel("i18n").getProperty("pdfDownloadText");
                MessageToast.show(messageText);

                var downloadUrl = `${this.oDataModel.sServiceUrl}${key}/$value`; 
                var link = document.createElement("a");
                link.download = "Sox Report.pdf";
                link.href = downloadUrl;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        });
    });
