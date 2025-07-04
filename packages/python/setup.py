from setuptools import setup, find_packages

with open("README.md", "r", encoding="utf-8") as f:
    long_description = f.read()

setup(
    name="qc2c",
    version="1.0.2",
    description="Map coordinates to country using sectorized geojson strategy",
    long_description=long_description,
    long_description_content_type="text/markdown",
    url="https://github.com/deadsmond/QC2C",
    author="Adam Lewicki",
    packages=find_packages(),
    install_requires=[
        "shapely==2.0.2",
        "tqdm==4.66.1",
        "geopandas==0.10.2",
        "matplotlib==3.5.3",
        "JSON-minify==0.3.0",
    ],
    classifiers=[
        "Programming Language :: Python :: 3",
        "License :: OSI Approved :: MIT License",
        "Operating System :: OS Independent",
    ],
    python_requires=">=3.6",
)
