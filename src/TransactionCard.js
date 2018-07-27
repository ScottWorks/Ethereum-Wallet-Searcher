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

        <form onSubmit={(e) => addMemo(e, transaction.tx_hash, memoInput)}>
          <label>
            <textarea
              type="text"
              placeholder={transaction.memo ? transaction.memo : null}
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
