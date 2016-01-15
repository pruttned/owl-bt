'use strict';

angular.module('editorApp')
  .controller('TreeCtrl', function($scope, hotkeys, ListSelectDialog) {

  $scope.items = [{
      name: 'Microsoft.CSharp',
      icon: 'cog'
    }, {
      name: 'Microsoft.JScript',
      icon: 'arrow-right'
    }, {
      name: 'Microsoft.VisualBasic'
    }, {
      name: 'Microsoft.Vsa'
    }, {
      name: 'Microsoft.Win32'
    }, {
      name: 'System'
    }, {
      name: 'System.CodeDom'
    }, {
      name: 'System.CodeDom.Compiler'
    }, {
      name: 'System.Collections'
    }, {
      name: 'System.Collections.Specialized'
    }, {
      name: 'System.ComponentModel'
    }, {
      name: 'System.ComponentModel.Design'
    }, {
      name: 'System.ComponentModel.Design.Serialization'
    }, {
      name: 'System.Configuration'
    }, {
      name: 'System.Configuration.Assemblies'
    }, {
      name: 'System.Configuration.Install'
    }, {
      name: 'System.Data'
    }, {
      name: 'System.Data.Common'
    }, {
      name: 'System.Data.Odbc'
    }, {
      name: 'System.Data.OleDb'
    }, {
      name: 'System.Data.OracleClient'
    }, {
      name: 'System.Data.SqlClient'
    }, {
      name: 'System.Data.SqlServerCe'
    }, {
      name: 'System.Data.SqlTypes'
    }, {
      name: 'System.Diagnostics'
    }, {
      name: 'System.Diagnostics.SymbolStore'
    }, {
      name: 'System.DirectoryServices'
    }, {
      name: 'System.Drawing'
    }, {
      name: 'System.Drawing.Design'
    }, {
      name: 'System.Drawing.Drawing2D'
    }, {
      name: 'System.Drawing.Imaging'
    }, {
      name: 'System.Drawing.Printing'
    }, {
      name: 'System.Drawing.Text'
    }, {
      name: 'System.EnterpriseServices'
    }, {
      name: 'System.EnterpriseServices.CompensatingResourceManager'
    }, {
      name: 'System.EnterpriseServices.Internal'
    }, {
      name: 'System.Globalization'
    }, {
      name: 'System.IO'
    }, {
      name: 'System.IO.IsolatedStorage'
    }, {
      name: 'System.Management'
    }, {
      name: 'System.Management.Instrumentation'
    }, {
      name: 'System.Messaging'
    }, {
      name: 'System.Net'
    }, {
      name: 'System.Net.Sockets'
    }, {
      name: 'System.Reflection'
    }, {
      name: 'System.Reflection.Emit'
    }, {
      name: 'System.Resources'
    }, {
      name: 'System.Runtime.CompilerServices'
    }, {
      name: 'System.Runtime.InteropServices'
    }, {
      name: 'System.Runtime.InteropServices.CustomMarshalers'
    }, {
      name: 'System.Runtime.InteropServices.Expando'
    }, {
      name: 'System.Runtime.Remoting'
    }, {
      name: 'System.Runtime.Remoting.Activation'
    }, {
      name: 'System.Runtime.Remoting.Channels'
    }, {
      name: 'System.Runtime.Remoting.Channels.Http'
    }, {
      name: 'System.Runtime.Remoting.Channels.Tcp'
    }, {
      name: 'System.Runtime.Remoting.Connames'
    }, {
      name: 'System.Runtime.Remoting.Lifetime'
    }, {
      name: 'System.Runtime.Remoting.Messaging'
    }, {
      name: 'System.Runtime.Remoting.Metadata'
    }, {
      name: 'System.Runtime.Remoting.Metadata.W3cXsd2001'
    }, {
      name: 'System.Runtime.Remoting.MetadataServices'
    }, {
      name: 'System.Runtime.Remoting.Proxies'
    }, {
      name: 'System.Runtime.Remoting.Services'
    }, {
      name: 'System.Runtime.Serialization'
    }, {
      name: 'System.Runtime.Serialization.Formatters'
    }, {
      name: 'System.Runtime.Serialization.Formatters.Binary'
    }, {
      name: 'System.Runtime.Serialization.Formatters.Soap'
    }, {
      name: 'System.Security'
    }, {
      name: 'System.Security.Cryptography'
    }, {
      name: 'System.Security.Cryptography.X509Certificates'
    }, {
      name: 'System.Security.Cryptography.Xml'
    }, {
      name: 'System.Security.Permissions'
    }, {
      name: 'System.Security.Policy'
    }, {
      name: 'System.Security.Principal'
    }, {
      name: 'System.ServiceProcess'
    }, {
      name: 'System.Text'
    }, {
      name: 'System.Text.RegularExpressions'
    }, {
      name: 'System.Threading'
    }, {
      name: 'System.Timers'
    }, {
      name: 'System.Web'
    }, {
      name: 'System.Web.Caching'
    }, {
      name: 'System.Web.Configuration'
    }, {
      name: 'System.Web.Hosting'
    }, {
      name: 'System.Web.Mail'
    }, {
      name: 'System.Web.Security'
    }, {
      name: 'System.Web.Services'
    }, {
      name: 'System.Web.Services.Configuration'
    }, {
      name: 'System.Web.Services.Description'
    }, {
      name: 'System.Web.Services.Discovery'
    }, {
      name: 'System.Web.Services.Protocols'
    }, {
      name: 'System.Web.SessionState'
    }, {
      name: 'System.Web.UI'
    }, {
      name: 'System.Web.UI.Design'
    }, {
      name: 'System.Web.UI.Design.WebControls'
    }, {
      name: 'System.Web.UI.HtmlControls'
    }, {
      name: 'System.Web.UI.WebControls'
    }, {
      name: 'System.Windows.Forms'
    }, {
      name: 'System.Windows.Forms.Design'
    }, {
      name: 'System.Xml'
    }, {
      name: 'System.Xml.Schema'
    }, {
      name: 'System.Xml.Serialization'
    }, {
      name: 'System.Xml.XPath'
    }, {
      name: 'System.Xml.Xsl'
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
