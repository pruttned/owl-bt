'use strict';

angular.module('editorApp')
  .controller('TreeCtrl', function($scope, hotkeys, ListSelectDialog) {

    $scope.items = [{
      text: 'Microsoft.CSharp',
      icon: 'cog'
    }, {
      text: 'Microsoft.JScript',
      icon: 'arrow-right'
    }, {
      text: 'Microsoft.VisualBasic'
    }, {
      text: 'Microsoft.Vsa'
    }, {
      text: 'Microsoft.Win32'
    }, {
      text: 'System'
    }, {
      text: 'System.CodeDom'
    }, {
      text: 'System.CodeDom.Compiler'
    }, {
      text: 'System.Collections'
    }, {
      text: 'System.Collections.Specialized'
    }, {
      text: 'System.ComponentModel'
    }, {
      text: 'System.ComponentModel.Design'
    }, {
      text: 'System.ComponentModel.Design.Serialization'
    }, {
      text: 'System.Configuration'
    }, {
      text: 'System.Configuration.Assemblies'
    }, {
      text: 'System.Configuration.Install'
    }, {
      text: 'System.Data'
    }, {
      text: 'System.Data.Common'
    }, {
      text: 'System.Data.Odbc'
    }, {
      text: 'System.Data.OleDb'
    }, {
      text: 'System.Data.OracleClient'
    }, {
      text: 'System.Data.SqlClient'
    }, {
      text: 'System.Data.SqlServerCe'
    }, {
      text: 'System.Data.SqlTypes'
    }, {
      text: 'System.Diagnostics'
    }, {
      text: 'System.Diagnostics.SymbolStore'
    }, {
      text: 'System.DirectoryServices'
    }, {
      text: 'System.Drawing'
    }, {
      text: 'System.Drawing.Design'
    }, {
      text: 'System.Drawing.Drawing2D'
    }, {
      text: 'System.Drawing.Imaging'
    }, {
      text: 'System.Drawing.Printing'
    }, {
      text: 'System.Drawing.Text'
    }, {
      text: 'System.EnterpriseServices'
    }, {
      text: 'System.EnterpriseServices.CompensatingResourceManager'
    }, {
      text: 'System.EnterpriseServices.Internal'
    }, {
      text: 'System.Globalization'
    }, {
      text: 'System.IO'
    }, {
      text: 'System.IO.IsolatedStorage'
    }, {
      text: 'System.Management'
    }, {
      text: 'System.Management.Instrumentation'
    }, {
      text: 'System.Messaging'
    }, {
      text: 'System.Net'
    }, {
      text: 'System.Net.Sockets'
    }, {
      text: 'System.Reflection'
    }, {
      text: 'System.Reflection.Emit'
    }, {
      text: 'System.Resources'
    }, {
      text: 'System.Runtime.CompilerServices'
    }, {
      text: 'System.Runtime.InteropServices'
    }, {
      text: 'System.Runtime.InteropServices.CustomMarshalers'
    }, {
      text: 'System.Runtime.InteropServices.Expando'
    }, {
      text: 'System.Runtime.Remoting'
    }, {
      text: 'System.Runtime.Remoting.Activation'
    }, {
      text: 'System.Runtime.Remoting.Channels'
    }, {
      text: 'System.Runtime.Remoting.Channels.Http'
    }, {
      text: 'System.Runtime.Remoting.Channels.Tcp'
    }, {
      text: 'System.Runtime.Remoting.Contexts'
    }, {
      text: 'System.Runtime.Remoting.Lifetime'
    }, {
      text: 'System.Runtime.Remoting.Messaging'
    }, {
      text: 'System.Runtime.Remoting.Metadata'
    }, {
      text: 'System.Runtime.Remoting.Metadata.W3cXsd2001'
    }, {
      text: 'System.Runtime.Remoting.MetadataServices'
    }, {
      text: 'System.Runtime.Remoting.Proxies'
    }, {
      text: 'System.Runtime.Remoting.Services'
    }, {
      text: 'System.Runtime.Serialization'
    }, {
      text: 'System.Runtime.Serialization.Formatters'
    }, {
      text: 'System.Runtime.Serialization.Formatters.Binary'
    }, {
      text: 'System.Runtime.Serialization.Formatters.Soap'
    }, {
      text: 'System.Security'
    }, {
      text: 'System.Security.Cryptography'
    }, {
      text: 'System.Security.Cryptography.X509Certificates'
    }, {
      text: 'System.Security.Cryptography.Xml'
    }, {
      text: 'System.Security.Permissions'
    }, {
      text: 'System.Security.Policy'
    }, {
      text: 'System.Security.Principal'
    }, {
      text: 'System.ServiceProcess'
    }, {
      text: 'System.Text'
    }, {
      text: 'System.Text.RegularExpressions'
    }, {
      text: 'System.Threading'
    }, {
      text: 'System.Timers'
    }, {
      text: 'System.Web'
    }, {
      text: 'System.Web.Caching'
    }, {
      text: 'System.Web.Configuration'
    }, {
      text: 'System.Web.Hosting'
    }, {
      text: 'System.Web.Mail'
    }, {
      text: 'System.Web.Security'
    }, {
      text: 'System.Web.Services'
    }, {
      text: 'System.Web.Services.Configuration'
    }, {
      text: 'System.Web.Services.Description'
    }, {
      text: 'System.Web.Services.Discovery'
    }, {
      text: 'System.Web.Services.Protocols'
    }, {
      text: 'System.Web.SessionState'
    }, {
      text: 'System.Web.UI'
    }, {
      text: 'System.Web.UI.Design'
    }, {
      text: 'System.Web.UI.Design.WebControls'
    }, {
      text: 'System.Web.UI.HtmlControls'
    }, {
      text: 'System.Web.UI.WebControls'
    }, {
      text: 'System.Windows.Forms'
    }, {
      text: 'System.Windows.Forms.Design'
    }, {
      text: 'System.Xml'
    }, {
      text: 'System.Xml.Schema'
    }, {
      text: 'System.Xml.Serialization'
    }, {
      text: 'System.Xml.XPath'
    }, {
      text: 'System.Xml.Xsl'
    }];

    $scope.open = function() {
      ListSelectDialog.open($scope.items)
        .result.then(function(item) {
          console.log('selected item = ' + item.text);
        }, function() {
          console.log('cancel');
        });
    };

    hotkeys.add({
      combo: 'up',
      description: 'This one goes to 11',
      callback: function() {
        console.log('root up');
      }
    });


  });
