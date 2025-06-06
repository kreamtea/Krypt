// import React, {useEffect, useState} from 'react';
// // import {ethers} from 'ethers';
// import { BrowserProvider, Contract } from 'ethers';

// import {contractABI, contractAddress} from '../utils/constants';

// export const TransactionContext = React.createContext();



// // const getEthereumContract = () => {
// //     const {ethereum} = window;
// //     const provider = new ethers.providers.Web3Provider(ethereum);
// //     const signer = provider.getSigner();
// //     const transactionContract = new ethers.Contract(contractAddress, contractABI, signer);

// //     console.log({
// //         provider,
// //         signer,
// //         transactionContract
// //     }); 
   
// // }
// const getEthereumContract = async () => {
//     const { ethereum } = window;
//     if (!ethereum) {
//         alert("Please install MetaMask.");
//         throw new Error("No Ethereum object found.");
//     }
//     const provider = new BrowserProvider(ethereum);
//     const signer = await provider.getSigner(); // NOTE: async
//     const transactionContract = new Contract(contractAddress, contractABI, signer);
//     return transactionContract;
// };



// //context - place
// export const TransactionProvider = ({children}) => {
//     const [currentAccount, setCurrentAccount] = useState('');
//     const [formData, setFormData] =  
//         useState({
//             addressTo: '',
//             amount:'',
//             keyword:'',
//             message:''
//         });


//     const handleChange = (e, name) => {
//         setFormData((prevState) => ({...prevState, [name]: e.target.value}));
//     };

//     const checkIfWalletIsConnected  = async () => {
//         try {
//             if(!ethereum) return alert("Please install Metamask.");
    
//             const accounts = await ethereum.request({method: 'eth_accounts'});
    
//             if(accounts.length){
//                 setCurrentAccount(accounts[0]);
    
//                 // getAllTransactions();
//             } else {
//             console.log("No accounts found");
//             }
//         } catch (error) {
//             console.log(error);
//             throw new Error("No ethereum object " + error.message)
//         }   
//     }


//     const connectWallet = async () => {
//         // console.log("Connect Wallet button clicked!"); 
//         const { ethereum } = window;
//         try{
//            if(!ethereum) return alert("Please install Metamask.");
//            const accounts = await ethereum.request({method: 'eth_requestAccounts'});
//            setCurrentAccount(accounts[0]);
//         } catch (error) {
//             console.log(error);
//             throw new Error("No ethereum object " + error.message)
//         }
//     }


//     // const sendTransaction = async () =>{
//     //     try {
//     //          if(!ethereum) return alert("Please install Metamask.");

//     //         const {addressTo, amount, keyword, message} = formData;
//     //         getEthereumContract();
//     //     } catch (error) {
//     //         console.log(error);
//     //         throw new Error("No ethereum object " + error.message)
//     //     }
//     // } 
//     const sendTransaction = async () => {
//         const { ethereum } = window;
//         try {
//             if (!ethereum) return alert("Please install Metamask.");
//             const { addressTo, amount, keyword, message } = formData;
//             const transactionContract = await getEthereumContract();

//             // Example: sending ETH (update as needed for your contract)
//             const provider = new BrowserProvider(ethereum);
//             const signer = await provider.getSigner();
//             const tx = await signer.sendTransaction({
//                 to: addressTo,
//                 value: (BigInt(Math.floor(Number(amount) * 1e18))).toString() // Convert ETH to wei
//             });

//             await tx.wait();
//             // Optionally interact with your contract here

//         } catch (error) {
//             console.log(error);
//             throw new Error("No ethereum object " + error.message);
//         }
//     };




//     useEffect(() => {
//         checkIfWalletIsConnected();
//     }, []);
//     return(
//         <TransactionContext.Provider value={{connectWallet, currentAccount, formData, setFormData, handleChange, sendTransaction}}>
//             {children}
//         </TransactionContext.Provider>
//     );
// }


//***************************************************
import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';

import { contractABI, contractAddress } from '../utils/constants';

export const TransactionContext = React.createContext();

const getEthereumContract = () => {
    const { ethereum } = window;
    if (!ethereum) {
        alert("Please install MetaMask.");
        throw new Error("No Ethereum object found.");
    }
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const transactionContract = new ethers.Contract(contractAddress, contractABI, signer);

    // Log the objects as you wanted
    // return transactionContract;

    return { provider, signer, transactionContract };
};


export const TransactionProvider = ({ children }) => {
    const [currentAccount, setCurrentAccount] = useState('');
    const [formData, setFormData] = useState({
        addressTo: '',
        amount: '',
        keyword: '',
        message: ''
    });
    const[isLoading, setIsLoading] = useState(false);
    const[transactionCount, setTransactionCount] = useState(localStorage.getItem('transactionCount'));
    const[transactions, setTransactions] = useState([]);

    const handleChange = (e, name) => {
        setFormData((prevState) => ({ ...prevState, [name]: e.target.value }));
    };

    
    const getAllTransactions = async () => {
        try {
            const { ethereum } = window; // <--- ADDED: Define ethereum here
            if (!ethereum) return alert("Please install MetaMask.");

            // Destructure to get transactionContract
            const { transactionContract } = getEthereumContract(); 
            
            // Ensure this matches your ABI. If your ABI has "getAllTransactions" (plural), change this back.
            const availableTransactions = await transactionContract.getAllTransaction(); 
            const structuredTransactions = availableTransactions.map((transaction) => ({
                addressTo: transaction.receiver,
                addressFrom: transaction.sender,
                timestamp: new Date(transaction.timestamp.toNumber() * 1000).toLocaleString(),
                message: transaction.message,
                keyword: transaction.keyword,
                amount: ethers.utils.formatEther(transaction.amount),
            }))
            console.log("Fetched and structured transactions:", structuredTransactions);
            
            setTransactions(structuredTransactions);
        } catch (error) {
            console.log(error);
            
        }
    }



    const checkIfWalletIsConnected = async () => {
        try {
            const { ethereum } = window;
            if (!ethereum) return alert("Please install MetaMask.");

            const accounts = await ethereum.request({ method: 'eth_accounts' });

            if (accounts.length) {
                setCurrentAccount(accounts[0]);
                getAllTransactions(); // If you have this function, you can uncomment it
            } else {
                console.log("No accounts found");
            }
        } catch (error) {
            console.log(error);
            throw new Error("No ethereum object " + error.message);
        }
    };

    const checkIfTransactionsExist = async () => {
        try {
            // Destructure to get transactionContract from the returned object <--- FIXED HERE
            const { transactionContract } = getEthereumContract(); 
            const transactionCount = await transactionContract.getTransactionCount();

            window.localStorage.setItem("transactionCount", transactionCount);
        } catch (error) {
            console.log(error);
            throw new Error("No ethereum object " + error.message);
        }
    }


    const connectWallet = async () => {
        try {
            const { ethereum } = window;
            if (!ethereum) return alert("Please install MetaMask.");
            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
            setCurrentAccount(accounts[0]);
        } catch (error) {
            console.log(error);
            throw new Error("No ethereum object " + error.message);
        }
    };


    const sendTransaction = async () => {
        try {
            const { ethereum } = window;
            if (!ethereum) return alert("Please install MetaMask.");

            // Only log the provider, signer, and contract
            const {addressTo, amount, keyword, message} = formData;
            const {transactionContract} = getEthereumContract();
            const parsedAmount = ethers.utils.parseEther(amount);

             await ethereum.request({
                method: 'eth_sendTransaction',
                params: [{
                from: currentAccount,
                to: addressTo,
                gas: '0x5208', // 21000 GWEI
                value: parsedAmount._hex, // 0.00001
                }]
            });

            const transactionHash = await transactionContract.addToBlockchain(addressTo, parsedAmount, message, keyword);

            setIsLoading(true);
            console.log(`loading - ${transactionHash.hash}`);
            await transactionHash.wait();
            setIsLoading(false);
            console.log(`Success - ${transactionHash.hash}`);

            const transactionCount = await transactionContract.getTransactionCount();
            setTransactionCount(transactionCount.toNumber());
            window.location.reload();
        } catch (error) {
            console.log(error);
            throw new Error("Transaction error: " + error.message);
        }
    };

    useEffect(() => {
        checkIfWalletIsConnected();
        checkIfTransactionsExist();
    }, []);

    return (
        <TransactionContext.Provider value={{
            connectWallet,
            currentAccount,
            formData,
            setFormData,
            handleChange,
            sendTransaction,
            transactions,
            isLoading
        }}>
            {children}
        </TransactionContext.Provider>
    );
};

