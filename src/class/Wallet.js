import { web3 } from '@/service/web3';
import { createWalletClass } from '@endpass/class';

const Wallet = createWalletClass(web3);

export default Wallet;
