import React, { useState, useEffect } from 'react';
import Head from 'next/head'
import { useRouter } from 'next/router'
import styles from '../styles/Home.module.css'
import { withTheme, createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import path from 'path'
import {
  Grid,
  Typography,
  Button,
  TextField,
  InputAdornment,
  Paper
} from '@material-ui/core'
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import Chain from '../components/chain'
import MultiChain from '../components/multichain'
import Header from '../components/header'

import SearchIcon from '@material-ui/icons/Search';
import AppsIcon from '@material-ui/icons/Apps';
import ListIcon from '@material-ui/icons/List';
import AddIcon from '@material-ui/icons/Add';
import useSWR from 'swr'

import classes from './index.module.css'

const searchTheme = createMuiTheme({
  palette: {
    type: 'light',
    primary: {
      main: '#2F80ED',
    },
  },
  shape: {
    borderRadius: '10px'
  },
  typography: {
    fontFamily: [
      'Inter',
      'Arial',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    body1: {
      fontSize: '12px'
    }
  },
  overrides: {
    MuiPaper: {
      elevation1: {
        "box-shadow": '0px 7px 7px #0000000A;',
        "-webkit-box-shadow": '0px 7px 7px #0000000A;',
        "-moz-box-shadow": '0px 7px 7px #0000000A;',
      }
    },
    MuiInputBase: {
      input: {
        fontSize: '14px'
      },
    },
    MuiOutlinedInput: {
      input: {
        padding: '12.5px 14px'
      },
      notchedOutline: {
        borderColor: "#FFF",
      }
    },
  },
});

const fetcher = (...args) => fetch(...args).then(res => res.json())

function Home({ changeTheme, theme }) {
  const { data, error } = useSWR('https://chainid.network/chains.json', fetcher)

  const [layout, setLayout] = useState('grid')
  const [search, setSearch] = useState('')
  const [hideMultichain, setHideMultichain] = useState('1')
  const router = useRouter()
  if (router.query.search) {
    setSearch(router.query.search)
    delete router.query.search
  }

  const onSearchChanged = (event) => {
    setSearch(event.target.value)
  }

  const handleLayoutChanged = (event, newVal) => {
    if (newVal !== null) {
      setLayout(newVal)
      localStorage.setItem('yearn.finance-invest-layout', newVal ? newVal : '')
    }
  }

  const addNetwork = () => {
    window.open('https://github.com/ethereum-lists/chains', '_blank')
  }

  const closeMultichain = (perma) => {
    setHideMultichain('1')
    localStorage.setItem('chainlist.org-hideMultichain', perma ? '1' : '0')
  }

  useEffect(() => {
    const multi = localStorage.getItem('chainlist.org-hideMultichain')
    if (multi) {
      setHideMultichain(multi)
    } else {
      setHideMultichain('0')
    }
  }, [])

  return (
    <div className={styles.container}>
      <Head>
        <title>AddNetworks.Xyz | Add Custom Network to Metamask in Just 1 Click!</title>
        <meta name="description" content="AddNetworks.Xyz is a list of EVM networks, Add Custom Network to Metamask in Just 1 Click! Users can use the information to connect their wallets (such as Metamask) and Web3 middleware providers to the appropriate Chain ID and Network ID to connect to the correct chain."/>
        <link rel="icon" href="/favicon.png" />
      </Head>

      <main className={styles.main}>
        <div className={theme.palette.type === 'dark' ? classes.containerDark : classes.container}>
          <div className={classes.copyContainer}>
            <div className={classes.copyCentered}>
              <Typography variant='h1' className={classes.chainListSpacing}><span className={classes.helpingUnderline}>AddNetworks.Xyz</span></Typography>
              <Typography variant='h2' className={classes.helpingParagraph}>Helping users connect to EVM powered networks</Typography>
              <Typography className={classes.subTitle}>AddNetworks.Xyz is a list of EVM networks. Users can use the information to connect their wallets and Web3 middleware providers to the appropriate Chain ID and Network ID to connect to the correct chain.</Typography>


              <div className={classes.socials}>
                <a className={`${classes.socialButton}`} href='https://www.facebook.com/groups/1142078806538512' target='_blank' rel="noopener noreferrer" >
                  <Typography variant='body1' className={classes.sourceCode}>Join Our Facebook Group</Typography>
                </a>
                
                  <p>EVM List Credit: ChainList</p>
                  
              </div>
            </div>
          </div>
          <div className={theme.palette.type === 'dark' ? classes.listContainerDark : classes.listContainer}>
            <div className={theme.palette.type === 'dark' ? classes.headerContainerDark : classes.headerContainer}>
              <div className={classes.filterRow}>
                <ThemeProvider theme={searchTheme}>
                  <Paper className={classes.searchPaper}>
                    <TextField
                      fullWidth
                      className={classes.searchContainer}
                      variant="outlined"
                      placeholder="ETH, Fantom, ..."
                      value={search}
                      onChange={onSearchChanged}
                      InputProps={{
                        endAdornment: <InputAdornment position="end">
                          <SearchIcon fontSize="small" />
                        </InputAdornment>,
                        startAdornment: <InputAdornment position="start">
                          <Typography className={classes.searchInputAdnornment}>
                            Search Networks
                          </Typography>
                        </InputAdornment>
                      }}
                    />
                  </Paper>
                </ThemeProvider>
              </div>
              <Header changeTheme={changeTheme} />
            </div>
            <div className={classes.cardsContainer}>
              {/* {hideMultichain === '0' && <MultiChain closeMultichain={closeMultichain} />} */}
              {
                data && data.filter((chain) => {
                  if (search === '') {
                    return true
                  } else {
                    //filter
                    return (chain.chain.toLowerCase().includes(search.toLowerCase()) ||
                      chain.chainId.toString().toLowerCase().includes(search.toLowerCase()) ||
                      chain.name.toLowerCase().includes(search.toLowerCase()) ||
                      (chain.nativeCurrency ? chain.nativeCurrency.symbol : '').toLowerCase().includes(search.toLowerCase()))
                  }
                }).map((chain, idx) => {
                  return <Chain chain={chain} key={idx} />
                })
              }
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default withTheme(Home)

// export const getStaticProps  = async () => {
//
//   try {
//     const chainsResponse = await fetch('https://chainid.network/chains.json')
//     const chainsJson = await chainsResponse.json()
//
//     return {
//       props: {
//         chains: chainsJson
//       },
//       revalidate: 60,
//     }
//   } catch (ex) {
//     return {
//       props: {
//         chains: []
//       }
//     }
//   }
//
// }

<!-- Global site tag (gtag.js) - Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-13ZQWBGB62"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-13ZQWBGB62');
</script>
