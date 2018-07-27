import React, { Component } from 'react';
import axios from 'axios';
import moment from 'moment';

import TransactionList from './TransactionList';

import './App.css';

function getLocalStorage() {
  if (localStorage.getItem("storedMemos") != null) {
    return JSON.parse(localStorage.getItem("storedMemos"))
  } else {
    return [];
  }
}

const initilizeStorage = getLocalStorage()

class App extends Component {
  constructor() {
    super();
    this.state = {
      address: '',
      transactions: '',
      storedMemos: initilizeStorage
    };

    this.getTransactions = this.getTransactions.bind(this)
    this.addMemo = this.addMemo.bind(this);
    this.convertTimeStamp = this.convertTimeStamp.bind(this)
    this.getMemos = this.getMemos.bind(this)
    this.convertArrayOfObjectsToCSV = this.convertArrayOfObjectsToCSV.bind(this)
    this.exportCSV = this.exportCSV.bind(this)
  }
  handleChange(key, value) {
    this.setState({
      [key]: value
    });
  }

  getTransactions() {
    const { address } = this.state;

    axios.get(`/api/transactions/${address}`).then((res) => {

      const transactions = res.data.result.map(elem => {
        let inOut;

        if (address.toLowerCase() == elem.from.toLowerCase()) {
          inOut = "OUT"
        } else {
          inOut = "IN"
        }

        let formattedTime = this.convertTimeStamp(elem.timeStamp, 'L');
        let memos = this.getMemos(elem.hash)

        return {
          from: elem.from,
          to: elem.to,
          inOut: inOut,
          tx_hash: elem.hash,
          time: formattedTime,
          memo: memos
        }
      })

      this.setState({
        address: '',
        transactions: transactions
      });
    });
  }

  addMemo(event, tx_hash, memo) {
    event.preventDefault();
    const { storedMemos } = this.state;
    const newMemo = [...storedMemos];

    newMemo.push({
      tx_hash: tx_hash,
      memo: memo
    });

    localStorage.setItem("storedMemos", JSON.stringify(newMemo));

    this.setState({
      storedMemos: newMemo
    });
  }

  convertTimeStamp(epochTime, timeFormat) {
    let time = moment.unix(epochTime);
    return moment(time).format(timeFormat);
  }

  getMemos(tx_hash) {
    const { storedMemos } = this.state
    let memoArray = [];

    storedMemos.map(elem => {
      if (tx_hash === elem.tx_hash) {
        memoArray.push(elem.memo)
      }
    })

    return memoArray
  }

  convertArrayOfObjectsToCSV(args) {
    var result, ctr, keys, columnDelimiter, lineDelimiter, data;

    data = args || null;
    if (data == null || !data.length) {
      return null;
    }

    columnDelimiter = args.columnDelimiter || ',';
    lineDelimiter = args.lineDelimiter || '\n';

    keys = Object.keys(data[0]);

    result = '';
    result += keys.join(columnDelimiter);
    result += lineDelimiter;

    data.forEach(function (item) {
      ctr = 0;
      keys.forEach(function (key) {
        if (ctr > 0) result += columnDelimiter;

        result += item[key];
        ctr++;
      });
      result += lineDelimiter;
    });

    return result;
  }

  exportCSV() {
    const { transactions } = this.state
    var data, filename, link;
    var csv = this.convertArrayOfObjectsToCSV(transactions);

    if (csv == null) {
      console.log('NULL!')
      return;
    }

    filename = 'export.csv';

    if (!csv.match(/^data:text\/csv/i)) {
      csv = 'data:text/csv;charset=utf-8,' + csv;
    }
    data = encodeURI(csv);

    link = document.createElement('a');
    link.setAttribute('href', data);
    link.setAttribute('download', filename);
    link.click();
  }


  render() {
    const { address, transactions, storedMemos } = this.state;
    return (
      <div className="App">
        <label>Search by Address: </label>
        <input
          type="text"
          onChange={(e) => this.handleChange('address', e.target.value)}
        />
        <input type="submit" value="Submit" onClick={this.getTransactions} />
        <input type="button" value="Export CSV" onClick={this.exportCSV} />

        {transactions && transactions.length > 0 ? (
          <TransactionList
            storedMemos={storedMemos}
            searchAddress={address}
            transactions={transactions}
            addMemo={this.addMemo}
          />
        ) : null}
      </div>
    );
  }
}

export default App;
