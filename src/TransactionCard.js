import React, { Component } from 'react';

class TransactionCard extends Component {
  constructor() {
    super();
    this.state = {
      memoInput: ''
    };
  }

  handleChange(key, value) {
    this.setState({
      [key]: value
    });
  }


  render() {
    const { memoInput } = this.state;
    const { transaction, addMemo } = this.props;

    return (
      <section>
        <p>Tx Hash: {transaction.tx_hash}</p>
        <p>Status: {transaction.inOut}</p>
        <p>From: {transaction.from}</p>
        <p>To: {transaction.to}</p>
        <p>Time: {transaction.time}</p>
        <p>Memos: </p>
        {transaction.memo && transaction.memo.length > 0 ? <DisplayMemos memos={transaction.memo} /> : null}

        <form onSubmit={(e) => addMemo(e, transaction.tx_hash, memoInput)}>
          <label>
            Add Memo:{' '}
            <input
              type="text"
              onChange={(e) => this.handleChange('memoInput', e.target.value)}
            />
          </label>
          <input type="submit" value="Submit" />
        </form>
      </section>
    );
  }
}

const DisplayMemos = ({ memos }) => {
  return memos.map((elem, idx) => {
    return (
      <div key={idx}>
        <p>{elem}</p>
      </div>
    );

  });
};


export default TransactionCard;
