import os
import markdown
import re
from fpdf import FPDF

class PDF(FPDF):
    def header(self):
        if self.page_no() > 1:
            self.set_font('Arial', 'I', 8)
            self.set_text_color(100, 100, 100)
            self.cell(0, 10, 'gesCasesRurals — Documentació Tècnica Completa', 0, 0, 'L')
            self.cell(0, 10, 'Implantació d\'Aplicacions Web', 0, 0, 'R')
            self.ln(10)
            self.set_draw_color(200, 200, 200)
            self.set_line_width(0.2)
            self.line(10, 18, 200, 18)

    def footer(self):
        # Position at 1.5 cm from bottom
        self.set_y(-15)
        self.set_font('Arial', 'I', 8)
        self.set_text_color(128, 128, 128)
        # Page number
        self.cell(0, 10, f'Pàgina {self.page_no()}/{{nb}}', 0, 0, 'C')

def strip_tags_inside_cells(html):
    def clean_cell(match):
        tag = match.group(1) # td
        attrs = match.group(2) or ''
        content = match.group(3)
        # Strip all HTML tags from the content
        clean_content = re.sub(r'<[^>]+>', '', content)
        return f'<{tag}{attrs}>{clean_content}</{tag}>'
    
    html = re.sub(r'<(td)([^>]*)>(.*?)</\1>', clean_cell, html, flags=re.DOTALL | re.IGNORECASE)
    return html

def replace_pre_with_font(html):
    def convert_pre(match):
        content = match.group(1)
        # Clean content of any HTML tags first
        content = re.sub(r'<[^>]+>', '', content)
        # Replace newlines with <br>
        content = content.replace('\n', '<br>')
        # Replace spaces with non-breaking spaces to preserve alignment
        content = content.replace(' ', '&nbsp;')
        return f'<font face="CourierNew" size="8">{content}</font>'
    
    # Match <pre><code class="...">...</code></pre>
    html = re.compile(r'<pre><code[^>]*>(.*?)</code></pre>', re.DOTALL | re.IGNORECASE).sub(convert_pre, html)
    # Match <pre>...</pre>
    html = re.compile(r'<pre[^>]*>(.*?)</pre>', re.DOTALL | re.IGNORECASE).sub(convert_pre, html)
    return html

def convert_md_to_pdf(md_path, pdf_path):
    print("Reading Markdown...")
    with open(md_path, 'r', encoding='utf-8') as f:
        md_text = f.read()

    # Pre-process Markdown: replace emojis with text descriptions
    replacements = {
        '🏡': '[Casa]',
        '👥': '[Capacitat]',
        '🛏': '[Habitacions]',
        '🚿': '[Banys]',
        '📐': '[Superfície]',
        '💰': '[Preu]',
        '📊': '[Dashboard]',
        '📋': '[Resum]',
        '✅': '[OK]',
        '❌': '[Error]',
        '✓': 'v',
        '✗': 'x',
        '🔒': '[Segur]',
        '🔑': '[Clau]',
        '📅': '[Data]',
        '⚡': '[Ràpid]',
        '🛡️': '[Escut]',
        '🛡': '[Escut]',
        '📝': '[Nota]',
        '🔔': '[Avís]',
        '💡': '[Idea]',
        '🗺️': '[Mapa]',
        '🗺': '[Mapa]',
        '📞': '[Telèfon]',
        '✉️': '[Email]',
        '✉': '[Email]',
        '👤': '[Usuari]',
        '🔑': '[Contrasenya]',
        '⚙️': '[Config]',
        '⚙': '[Config]',
        '🗑️': '[Eliminar]',
        '🗑': '[Eliminar]',
        '✏️': '[Editar]',
        '✏': '[Editar]',
        '➕': '[Afegir]',
        '🔍': '[Cerca]',
        '📥': '[Rebre]',
        '📤': '[Enviar]',
        '🚀': '[Llançar]',
        '💻': '[Client]',
        '🖥️': '[Servidor]',
        '🖥': '[Servidor]',
        '🛢️': '[BD]',
        '🛢': '[BD]',
        '🔒': '[Seguretat]',
        '🔓': '[Obert]',
        '🚦': '[Estat]',
        '📈': '[Gràfic]',
        '🛑': '[Aturar]',
        '⚠️': '[Atenció]',
        '⚠️': '[Atenció]',
        '🟡': '[Pendent]',
        '🟢': '[Acceptat]',
        '🔴': '[Rebutjat]',
    }
    
    for emoji, text in replacements.items():
        md_text = md_text.replace(emoji, text)

    print("Converting Markdown to HTML...")
    # Convert Markdown to HTML with tables and fenced code
    html_content = markdown.markdown(
        md_text, 
        extensions=['tables', 'fenced_code']
    )

    # Replace th tags with td tags for uniform parser rendering
    html_content = html_content.replace('<th>', '<td>')
    html_content = html_content.replace('</th>', '</td>')

    # Remove thead and tbody to satisfy FPDF2's basic table parser
    html_content = html_content.replace('<thead>', '')
    html_content = html_content.replace('</thead>', '')
    html_content = html_content.replace('<tbody>', '')
    html_content = html_content.replace('</tbody>', '')

    # Clean cells of nested HTML tags to avoid rendering errors
    html_content = strip_tags_inside_cells(html_content)

    # Convert pre tags to font tags using our custom CourierNew font
    html_content = replace_pre_with_font(html_content)

    # Convert inline code <code>...</code> to CourierNew font
    html_content = html_content.replace('<code>', '<font face="CourierNew">')
    html_content = html_content.replace('</code>', '</font>')

    print("Initializing PDF...")
    pdf = PDF(orientation='P', unit='mm', format='A4')
    pdf.alias_nb_pages()
    
    # Register TrueType Fonts from macOS system paths
    font_dir = '/System/Library/Fonts/Supplemental'
    
    # Body font: Arial
    pdf.add_font('Arial', '', os.path.join(font_dir, 'Arial.ttf'))
    pdf.add_font('Arial', 'B', os.path.join(font_dir, 'Arial Bold.ttf'))
    pdf.add_font('Arial', 'I', os.path.join(font_dir, 'Arial Italic.ttf'))
    pdf.add_font('Arial', 'BI', os.path.join(font_dir, 'Arial Bold Italic.ttf'))
    
    # Monospaced font: Courier New
    pdf.add_font('CourierNew', '', os.path.join(font_dir, 'Courier New.ttf'))
    pdf.add_font('CourierNew', 'B', os.path.join(font_dir, 'Courier New Bold.ttf'))
    pdf.add_font('CourierNew', 'I', os.path.join(font_dir, 'Courier New Italic.ttf'))
    pdf.add_font('CourierNew', 'BI', os.path.join(font_dir, 'Courier New Bold Italic.ttf'))

    pdf.add_page()
    
    # Set default font
    pdf.set_font('Arial', size=10)
    pdf.set_text_color(30, 30, 30)

    # Wrap the entire content in Arial font tag to ensure it uses our TrueType Arial
    html_content = f'<font face="Arial">{html_content}</font>'

    print("Writing HTML content to PDF...")
    pdf.write_html(html_content)

    print("Saving PDF...")
    pdf.output(pdf_path)
    print(f"PDF generated successfully at: {pdf_path}")

if __name__ == "__main__":
    convert_md_to_pdf('gesCasesRurals_documentacio_completa.md', 'gesCasesRurals_documentacio_completa.pdf')
