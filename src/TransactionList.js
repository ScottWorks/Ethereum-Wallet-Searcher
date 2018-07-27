import React from 'react';
import TransactionCard from './TransactionCard';

function TransactionList(props) {
  const { storedMemos, searchAddress, transactions, addMemo } = props;
  return (
    <section>
      <DisplayTransactions
        storedMemos={storedMemos}
        searchAddress={searchAddress}
        transactions={transactions}
        addMemo={addMemo}
      />
    </section>
  );
}

const DisplayTransactions = ({
  storedMemos,
  searchAddress,
  transactions,
  addMemo
}) => {
  return transactions.map((elem, idx) => {
    return (
      <div key={idx}>
        <TransactionCard
          storedMemos={storedMemos}
          searchAddress={searchAddress}
          transaction={elem}
          addMemo={addMemo}
        />
      </div>
    );
  });
};

export default TransactionList;
