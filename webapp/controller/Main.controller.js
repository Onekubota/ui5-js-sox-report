sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, Filter, FilterOperator) {
        "use strict";

        return Controller.extend("com.ewm.yy1soxui5.controller.Main", {
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
                this.getOwnerComponent().getModel().attachRequestCompleted(this.onTableDataReceived,this);
                this._oSmartFilter = this.getView().byId("smartFilterBar");
            },

            onBeforeRebindTable: function(oEvent) {
                var mBindingParams = oEvent.getParameter("bindingParams");
                var oSelect = this._oSmartFilter.getControlByKey("Process");
                var processKey = oSelect.getSelectedKey();
                var newFilter = new Filter("Process", FilterOperator.EQ, processKey);
                mBindingParams.filters.push(newFilter);
            },

            onTableDataReceived: function(oEvent) {
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
            }
        });
    });
