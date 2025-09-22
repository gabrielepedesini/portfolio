export default function Footer() {
	const currentYear = new Date().getFullYear();

	return (
		<footer className="footer" style={{ display: "block" }}>
			<div className="container">
				<div className="copyright">
					© <span className="year">{currentYear}</span> gabrielepedesini
				</div>
			</div>
		</footer>
	);
}