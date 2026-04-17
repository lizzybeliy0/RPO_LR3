import React, { useState, useEffect } from 'react';
import { transactions } from '../../services/api';
import { Transaction, User } from '../../types';

interface TransactionsProps {
    user: User;
}

const Transactions: React.FC<TransactionsProps> = ({ user }) => {
    const [transactionsList, setTransactionsList] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchId, setSearchId] = useState('');
    const isAdmin = user.is_admin;

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        try {
            let response;
            if (isAdmin) {
                response = await transactions.getAll();
            } else {
                response = await transactions.getMyTransactions();
            }
            setTransactionsList(response.data);
        } catch (err) {
            console.error('Error fetching transactions:', err);
        } finally {
            setLoading(false);
        }
    };

    const filteredTransactions = searchId
        ? transactionsList.filter(t => t.id === parseInt(searchId))
        : transactionsList;

    return (
        <div className="transactions-container">
            <div className="header-actions">
                <h2>{isAdmin ? 'Все транзакции' : 'Мои транзакции'}</h2>
                <input
                    type="text"
                    placeholder="Поиск по ID..."
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                    className="search-input"
                />
            </div>

            {loading ? (
                <div>Загрузка...</div>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Сумма</th>
                            <th>Card ID</th>
                            <th>Terminal ID</th>
                            <th>Дата и время</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTransactions.map(tx => (
                            <tr key={tx.id}>
                                <td>{tx.id}</td>
                                <td>{tx.amount} ₽</td>
                                <td>{tx.card_id}</td>
                                <td>{tx.terminal_id}</td>
                                <td>{new Date(tx.created_at).toLocaleString('ru-RU')}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default Transactions;