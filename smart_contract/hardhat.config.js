// https://eth-sepolia.g.alchemy.com/v2/UIer_gHYpy_KDLZiwt6Xgo83RK3uF4z9

require('@nomicfoundation/hardhat-toolbox');

module.exports = {
  solidity: '0.8.0',
  networks: {
    sepolia: {
      url: 'https://eth-sepolia.g.alchemy.com/v2/UIer_gHYpy_KDLZiwt6Xgo83RK3uF4z9',
      accounts: ['b35170de0b2ac2074887225faaf93c4cc18294ac88679d0b15474ae71ec67253'] //priv key
    }
  }
}