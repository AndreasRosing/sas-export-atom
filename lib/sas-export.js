'use babel';

import SasExportView from './sas-export-view';
import { CompositeDisposable } from 'atom';
const fs = require('fs')

// Set default path for the file export
module.exports = {
  config: {
    setPath: {
      type: 'string',
      description: 'Set path and file name for export:',
      default: 'G:/sasfiles/torun.sas'
    }
  },

  sasExportView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.sasExportView = new SasExportView(state.sasExportViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.sasExportView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'sas-export:toggle': () => this.toggle()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.sasExportView.destroy();
  },

  serialize() {
    return {
      sasExportViewState: this.sasExportView.serialize()
    };
  },

  toggle() {
    // Access Editor text
    let editor
    // Set path from settings
    let path = atom.config.get('sas-export.setPath')
    // If selected text in Editor then export that
    if (editor = atom.workspace.getActiveTextEditor()) {
      let selection = editor.getSelectedText()
      let all_text = editor.getText()
      if (selection) {
        fs.writeFile(path, selection)
      } else {
        fs.writeFile(path, all_text)
      }
    }
    // Add notifications
    atom.notifications.addSuccess('Export to SAS file successful')
    atom.notifications.addError('Export to SAS file failed')
  },



};
