/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

/* Method to authenticate user with Salesforce Mobile SDK's OAuth Plugin */
var authenticateUser = function (successHandler, errorHandler) {

    // Get salesforce mobile sdk OAuth plugin
    var oauthPlugin = cordova.require("com.salesforce.plugin.oauth");

    // Call getAuthCredentials to get the initial session credentials
    oauthPlugin.getAuthCredentials(
        // Callback method when authentication succeeds.
        function (creds) {
            // Create forcetk client instance for rest API calls
            var credsObject = JSON.parse(creds);
            var forceClient = new force.Client(credsObject.ClientId, credsObject.InstanceUrl);
            forceClient.setSessionToken(credsObject.AccessToken, "v37.0", credsObject.InstanceUrl);
            forceClient.setRefreshToken(credsObject.RefreshToken);

            // Call success handler and handover the forcetkClient
            successHandler(forceClient);
        },
        function (error) {
            alert('Failed to authenticate user: ' + error);
        }
    );
}

/* This method will render a list of users from current salesforce org */
var showUsersList = function (forceClient) {

    fetchRecords(forceClient, function (data) {
        var accounts = data.records;

        var listItemsHtml = '';
        for (var i = 0; i < users.length; i++) {
            listItemsHtml += ('<li class="table-view-cell"><div class="media-body">' + accounts[i].Name + '</div></li>');
        }

        document.querySelector('#account').innerHTML = listItemsHtml;
    })
}

/* This method will fetch a list of user records from salesforce. 
Just change the soql query to fetch another sobject. */
var fetchRecords = function (forceClient, successHandler) {
    var soql = 'SELECT Id, Name FROM Account LIMIT 10';
    forceClient.query(soql, successHandler, function (error) {
        alert('Failed to fetch accounts: ' + error);
    });
};

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
        authenticateUser(showUsersList);
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        //var parentElement = document.getElementById(id);
        //var listeningElement = parentElement.querySelector('.listening');
        //var receivedElement = parentElement.querySelector('.received');

        //listeningElement.setAttribute('style', 'display:none;');
        //receivedElement.setAttribute('style', 'display:block;');

        //console.log('Received Event: ' + id);
    }
};

app.initialize();