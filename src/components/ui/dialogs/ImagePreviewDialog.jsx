import {
	Dialog,
	DialogContent,
	DialogTitle,
	IconButton,
	Skeleton
} from "@mui/material"
import React, { useState } from "react"

const ImagePreviewDialog = ({ url = "", open, setOpen }) => {
	const [imageLoading, setImageLoading] = useState(true)
	return (
		<div>
			<Dialog
				open={open}
				onClose={() => setOpen(false)}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
				disableEscapeKeyDown={true}
			>
				<DialogTitle>
					<div className="close-btn-wrapper">
						<IconButton
							variant="onlyIcon"
							color="primary"
							onClick={() => setOpen(false)}
						>
							<i className="bi bi-x" />
						</IconButton>
					</div>
				</DialogTitle>
				<DialogContent className="image-preview-content">
					{imageLoading ? (
						<Skeleton variant="rounded" width={500} height={300} />
					) : (
						<img
							src={`${process.env.REACT_APP_BACKEND_URL}/${url}`}
							alt="image-preview"
							className="h-full w-full"
							loading="lazy"
						/>
					)}
					<img
						src={`${process.env.REACT_APP_BACKEND_URL}/${url}`}
						alt="image-preview"
						className="w-0 h-0"
						onLoad={() => setImageLoading(false)}
						loading="lazy"
					/>
				</DialogContent>
			</Dialog>
		</div>
	)
}

export default ImagePreviewDialog
