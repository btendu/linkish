import LinkIcon from "@mui/icons-material/Link";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import React, { useEffect, useState } from "react";
import LinkOffIcon from "@mui/icons-material/LinkOff";
import DeleteIcon from "@mui/icons-material/Delete";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import EditIcon from "@mui/icons-material/Edit";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import Tooltip from "@mui/material/Tooltip";
import logo from "../../images/tinyhost.png";
import Image from "next/image";
import { useRouter } from "next/router";
import { toPng } from 'html-to-image';
import QRCode from "react-qr-code";
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { URI } from "@/source";
import toast, { Toaster } from "react-hot-toast";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#f3f4f6",
    color: "#898989",
    fontSize: 12,
    border: 0,
    padding: 11,
    [theme.breakpoints.down("xl")]: {
      fontSize: 10,
      padding: 8,
    },
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 11,
    border: 0,
    padding: 14,
    [theme.breakpoints.down("xl")]: {
      fontSize: 9,
      padding: 10,
    },
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(even)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}


export default function Dashboard() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [linkData, setLinkData] = React.useState([])
  const [title, setTitle] = React.useState("")
  const [link, setLink] = React.useState("")
  const [url, seturl] = useState("");
  const qrCodeRef = React.useRef(null)
  const [qrIsVisible, setQrIsVisible] = useState(false);
  const open = anchorEl;
  const [openQr, setOpenQr] = React.useState(false);
  const [openAddLink, setOpenAddLink] = React.useState(false);


  const router = useRouter();
  const { slug } = router.query;

  useEffect(() => {
    console.log("Id", slug);
    if (typeof window !== "undefined") {
      const currentUrl = window.location.href;
      const replacedWord = currentUrl.replace('dashboard', 'view')
      seturl(replacedWord);
    }
  }, []);

  const fetchUserData = async () => {
    const bodyObject = {
      userID: slug,
    };
    const response = await fetch(`${URI}/api/getlinks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(bodyObject),
    });
    const result = await response.json();
    console.log("Result ",result)
    setLinkData(result?.data.links);
  };

  useEffect(() => {
    if (slug) {
      fetchUserData();
    }
  }, [slug]);

  const handleOpenQR = () => {
    setOpenQr(true)
    if (!url) {
      return;
    }
    setQrIsVisible(true);
  };

  const handleCloseQR = () => setOpenQr(false);

  const handleOpenAddLinks = () => {
    setOpenAddLink(true)
  };

  const handleCloseAddLinks = () => setOpenAddLink(false);

  


  const downloadQRCode = () => {
    toPng(qrCodeRef.current)
      .then(function (dataUrl) {
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = "qr-code.png";
        link.click();
      })
      .catch(function (error) {
        console.error("Error generating QR code:", error);
      });
  };

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    borderRadius: 5,
    p: 4,
  };


  const styleLink = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    borderRadius: 5,
    p: 4,
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  function copyToClipboard(text) {
    navigator.clipboard.writeText(text)
      .then(() => {
        toast.success("Link copied!")
        console.log('Text copied to clipboard');
      })
      .catch(err => {
        console.error('Error copying text: ', err);
      });
  }

  const handleLinks = async () => {
    const bodyObject = {
      userId: slug,
      title: title,
      link: link,
      status: "active"
    }
    const response = await fetch(`${URI}/api/addlink`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(bodyObject)
    })
    const result = await response.json();
    console.log("Reuslt of adding", result)
    setLinkData(result.data.links)
    if (response.ok) {
      toast.success("Successfully added link");
      handleCloseAddLinks()
    } else {
      toast.error("Failed to add link");
    }
  }

  return (
    <div style={{ backgroundColor: "#fbfbfb" }}>
      <div className="flex justify-center items-center headerDiv">
        <div className="w-5/6 border rounded-2xl min-h-8 xl:p-2 2xl:p-4 mt-10 bg-white shadow-[0_12px_41px_-11px_rgba(199,199,199)]">
          <div className="flex">
            <Image
              src={logo}
              alt="logo"
              style={{ height: "11%", width: "11%" }}
            />
            <span className=" text-base cursor-pointer xl:mt-1.5 2xl:mt-4 font-sans text-slate-500 ml-10 mr-5">
              Products
            </span>
            <span className="text-base cursor-pointer xl:mt-1.5 2xl:mt-4 font-sans text-slate-500 mr-5">
              Use Cases
            </span>
            <span className="text-base cursor-pointer xl:mt-1.5 2xl:mt-4 font-sans text-slate-500 mr-5">
              Blogs
            </span>
            <button className="bg-purple-200 text-sm text-purple-700 font-medium ml-auto rounded-lg xl:h-8 xl:pt-0 pb-0 pl-1 pr-1 2xl:pt-1 pb-1 pl-2 pr-2 h-10 mt-2">
              Sign Out
            </button>
          </div>
        </div>
        <Toaster />
      </div>
      <div class="text-[#333] rounded-xl font-[sans-serif] linkDiv">
        <div className="w-full flex items-center justify-center xl:pt-8  2xl:mt-10 2xl:pt-10">
          <span class="mt-4 text-xl font-sans text-purple-700 font-medium">
            Your link :
            <span className="text-sm text-gray-600 font-sans font-medium ml-2 mr-5">
              {" "}
              {url}
            </span>
            <Tooltip title="Copy" onClick={() => copyToClipboard(url)}>
              <IconButton
                style={{
                  fontSize: 13,
                  paddingTop: 3,
                  paddingBottom: 3,
                  paddingLeft: 5,
                  paddingRight: 5,
                  borderRadius: 7,
                  border: "1px solid #19a89d",
                  color: "#19a89d",
                  fontWeight: 700,
                }}
              >
                Copy URL
                <ContentCopyIcon
                  size="sm"
                  style={{ fontSize: 17, color: "#19a89d", marginLeft: 7 }}
                />
              </IconButton>
            </Tooltip>
            <Tooltip title="Generate QR Code" onClick={handleOpenQR}>
              <IconButton
                style={{
                  fontSize: 13,
                  paddingTop: 3,
                  paddingBottom: 3,
                  paddingLeft: 5,
                  paddingRight: 5,
                  borderRadius: 7,
                  border: "1px solid #8a53fe",
                  color: "#8a53fe",
                  fontWeight: 700,
                  marginLeft: 17,
                }}
              >
                Generate QR Code
                <QrCode2Icon
                  size="sm"
                  style={{ fontSize: 22, color: "#8a53fe", marginLeft: 7 }}
                />
              </IconButton>
            </Tooltip>
            <Modal
              aria-labelledby="transition-modal-title"
              aria-describedby="transition-modal-description"
              open={openQr}
              onClose={handleCloseQR}
              closeAfterTransition
              slots={{ backdrop: Backdrop }}
              slotProps={{
                backdrop: {
                  timeout: 500,
                },
              }}
            >
              <Fade in={openQr}>
                <Box sx={style} className="border-0">
                  <Typography id="transition-modal-title" variant="h6" component="h2">
                    Your Unique link QR Code is ready
                  </Typography>
                  {qrIsVisible && (
                    <div className="qrcode__download" ref={qrCodeRef}>
                      <div className="qrcode__image" >
                        <QRCode value={url} size={200} />
                      </div>
                      <button className="bg-purple-200 text-purple-700 border rounded-lg p-3" onClick={downloadQRCode}>Download QR Code</button>
                    </div>
                  )}
                </Box>
              </Fade>
            </Modal>
          </span>
        </div>
      </div>
      <div className="flex justify-center items-center liveCard">
        <div className=" xl:h-content 2xl:h-content w-content bg-white border rounded-2xl shadow-[0_12px_41px_-11px_rgba(199,199,199)]">
          <div className="xl:mx-3 xl:mt-2 2xl:mx-6 2xl:mt-5">
            <div className="flex justify-between xl:mt-3 2xl:mt-6">
              <div className="font-sans text-2xl font-medium subpixel-antialiased flex">
                Live Links
                <div
                  className="bg-purple-200 text-purple-800 w-fit h-auto p-1 font-sans mt-1.5 ml-3 mb-2"
                  style={{ borderRadius: 10 }}
                >
                  <div className="font-sans mr-1 ml-1 text-xs font-base">
                    2/4 Live
                  </div>
                </div>
              </div>
              <button className="font-sans rounded-xl font-medium text-xs pl-3 pr-3 pt-0 pb-0 rounded-2xl bg-black text-white " onClick={handleOpenAddLinks}>
                Add Link <LinkIcon style={{ fontSize: 20, marginLeft: 2 }} />
              </button>
              <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={openAddLink}
                onClose={handleCloseAddLinks}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{
                  backdrop: {
                    timeout: 500,
                  },
                }}
              >
                <Fade in={openAddLink}>
                  <Box sx={styleLink} className="border-0">
                    <Typography  alignContent={'center'} id="transition-modal-title" variant="h6" component="h2">
                      Add Link
                    </Typography>
                    <div className="mt-5">
                      <div>Title :</div>
                      <div>
                        <input type="text" className="mt-3 h-10 w-full  border-2 p-3  rounded-lg mb-5 " placeholder="Enter title" onChange={(e) => setTitle(e.target.value)} value={title}></input>
                      </div>
                      <div>Link :</div>
                      <div>
                        <input type="text" className="mt-3 h-10 w-full  border-2 p-3  rounded-lg" placeholder="Enter link" onChange={(e) => setLink(e.target.value)} value={link}></input>
                      </div>
                      <button className="ml-80 font-medium mt-5 bg-purple-200 text-purple-700 border rounded-lg pt-1 pb-1 pr-2.5 pl-2.5 h-fit" onClick={handleLinks}>Add Link</button>
                    </div>
                  </Box>
                </Fade>
              </Modal>
            </div>
            <div className="font-sans xl:mt-5 xl:mb-2 2xl:mt-10 2xl:mb-4">
              <Table
                sx={{ minWidth: 400, border: "none" }}
                aria-label="customized table"
                size="sm"
              >
                <TableHead>
                  <TableRow>
                    <StyledTableCell
                      align="left"
                      style={{
                        borderTopLeftRadius: 15,
                        borderBottomLeftRadius: 15,
                      }}
                    >
                      Status
                    </StyledTableCell>
                    <StyledTableCell align="left">Domain</StyledTableCell>
                    <StyledTableCell
                      align="center"
                      style={{
                        borderTopleftRadius: 15,
                        borderBottomleftRadius: 15,
                      }}
                    >
                      Actions
                    </StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {linkData?.map((row) => (
                    <StyledTableRow key={row}>
                      <StyledTableCell
                        align="left"
                        style={{
                          borderTopLeftRadius: 15,
                          borderBottomLeftRadius: 15,
                        }}
                      >{row.status ==="active" ?  
                      <div
                          className="bg-green-300 text-green-800 w-fit h-auto p-1 font-sans flex"
                          style={{ borderRadius: 10 }}
                        >
                          {" "}
                          <div className="bg-green-800 w-1 h-1 rounded-xl mt-1.5 ml-1 mr-1"></div>
                          <div className="font-sans mr-1">Active</div>
                        </div>
                        :
                        <div
                          className="bg-red-300 text-red-800 w-fit h-auto p-1 font-sans flex"
                          style={{ borderRadius: 10 }}
                        >
                          {" "}
                          <div className="bg-red-800 w-1 h-1 rounded-xl mt-1.5 ml-1 mr-1"></div>
                          <div className="font-sans mr-1">In Active</div>
                        </div>}

                      </StyledTableCell>
                      <StyledTableCell align="left">
                        <a href={row.link} className="text-purple-700 text-sm font-sans font-medium">{row.link}</a>
                      </StyledTableCell>
                      <StyledTableCell
                        align="right"
                        style={{
                          borderTopRightRadius: 15,
                          borderBottomRightRadius: 15,
                        }}
                      >
                        {" "}
                        <div>
                          <Tooltip title="Copy" onClick={copyToClipboard}>
                            <IconButton style={{ paddingLeft: 0 }}>
                              <ContentCopyIcon
                                size="sm"
                                style={{ fontSize: 17, color: "#19a89d" }}
                              />
                            </IconButton>
                          </Tooltip>
                          <IconButton
                            aria-label="more"
                            id="long-button"
                            aria-controls={open ? "long-menu" : undefined}
                            aria-expanded={open ? "true" : undefined}
                            aria-haspopup="true"
                            onClick={handleClick}
                            size="sm"
                          >
                            <MoreVertIcon size="sm" />
                          </IconButton>
                          <Menu
                            size="sm"
                            id="long-menu"
                            MenuListProps={{
                              "aria-labelledby": "long-button",
                            }}
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            PaperProps={{
                              style: {
                                width: "auto",
                                boxShadow: "none",
                                fontSize: 12,
                                border: "1px solid gray",
                                borderRadius: 15,
                              },
                            }}
                          >
                            <MenuItem
                              size="sm"
                              className="text-sm text-slate-500"
                              onClick={handleClose}
                            >
                              <LinkOffIcon className="mr-2 inActive text-cyan-500" /> In
                              Active
                            </MenuItem>
                            <MenuItem
                              size="sm"
                              className="text-sm text-slate-500"
                              onClick={handleClose}
                            >
                              <EditIcon className="mr-2 editOptions text-green-500" /> Edit
                            </MenuItem>
                            <MenuItem
                              size="sm"
                              className="text-sm text-slate-500"
                              onClick={handleClose}
                            >
                              <DeleteIcon className="mr-2 deleteOptions text-red-500" />{" "}
                              Delete
                            </MenuItem>
                          </Menu>
                        </div>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
