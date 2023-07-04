const version = require('./version.js');
console.log(version)

module.exports = {
	pdf_options: {
		format: 'A4',
		margin: '25mm 12mm 25mm 12mm',
		displayHeaderFooter: true,
		headerTemplate: `
			<style>
				.header, .footer { padding: 0mm; margin: 10mm; width: 100%; text-align: right; font-size: 8px; }
				.border-bottom { border-bottom: 1pt solid #eeeeee; }
        			.border-top { border-top: 1pt solid #eeeeee; }
			</style>
			<div class="border-bottom header">Version ${version.tag}</div>
		`,
		footerTemplate: `
			<div class="border-top footer">
				Page <span class="pageNumber"></span> / <span class="totalPages"></span>
			</div>
		`,
	}
}
