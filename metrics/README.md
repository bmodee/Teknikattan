# Code Metrics

This documents describes how to install and run the rust-code-analysis on a unix machine, some alteration needed for a Windows system.

## Installing

You will need to do the following things to install the client:

1. Install Rust on your system by visiting https://www.rust-lang.org/tools/install or typing following in the terminal

```bash
curl https://sh.rustup.rs -sSf | sh
```

2. Clone the rust-code-analysis repository from https://github.com/mozilla/rust-code-analysis

```bash
git clone https://github.com/mozilla/rust-code-analysis.git
```

3. Enter the rust-code-analysis folder

```bash
cargo build --workspace

cargo install rust-code-analysis-cli
```

## Using

For each function space, rust-code-analysis computes the list of metrics described above. At the end of this process, rust-code-analysis-cli dumps the result formatted in a certain way on the screen.

1. Create a folder for the the outputs, for this guide it will be called "metrics-client" and "metrics-server"

# Frontend

2. Run the analysis tool for the frontend

```bash
 ./rust-code-analysis-cli -m --pr -p /path/to/teknikattan-scoring-system/client/src -o /path/to/metrics-client -O json
```

# Backend

3. Run the analysis tool for the backend

```bash
 ./rust-code-analysis-cli -m --pr -p /path/to/teknikattan-scoring-system/server/app -o /path/to/metrics-server -O json
```

# Metrics

Now the tool has analyzed the projekt and has outputted json files which the script will extrac the metrics from.
Don't forget to change the path in the script.

```bash
python3 metrics-script.py
```

## rust-code-analysis documentation

To read more about the tool, see https://mozilla.github.io/rust-code-analysis/index.html

# Citation

```
@article{ARDITO2020100635,
    title = {rust-code-analysis: A Rust library to analyze and extract maintainability information from source codes},
    journal = {SoftwareX},
    volume = {12},
    pages = {100635},
    year = {2020},
    issn = {2352-7110},
    doi = {https://doi.org/10.1016/j.softx.2020.100635},
    url = {https://www.sciencedirect.com/science/article/pii/S2352711020303484},
    author = {Luca Ardito and Luca Barbato and Marco Castelluccio and Riccardo Coppola and Calixte Denizet and Sylvestre Ledru and Michele Valsesia},
    keywords = {Algorithm, Software metrics, Software maintainability, Software quality},
    abstract = {The literature proposes many software metrics for evaluating the source code non-functional properties, such as its complexity and maintainability. The literature also proposes several tools to compute those properties on source codes developed with many different software languages. However, the Rust language emergence has not been paired by the community’s effort in developing parsers and tools able to compute metrics for the Rust source code. Also, metrics tools often fall short in providing immediate means of comparing maintainability metrics between different algorithms or coding languages. We hence introduce rust-code-analysis, a Rust library that allows the extraction of a set of eleven maintainability metrics for ten different languages, including Rust. rust-code-analysis, through the Abstract Syntax Tree (AST) of a source file, allows the inspection of the code structure, analyzing source code metrics at different levels of granularity, and finding code syntax errors before compiling time. The tool also offers a command-line interface that allows exporting the results in different formats. The possibility of analyzing source codes written in different programming languages enables simple and systematic comparisons between the metrics produced from different empirical and large-scale analysis sources.}
}
```
