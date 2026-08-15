# stackmind FastAPI live sample

Minimal FastAPI app used to battle-test the Python kit.

```bash
node bin/stackmind.js init python ./examples/python_live --force
cd examples/python_live
python -m venv .venv
# Windows: .venv\Scripts\activate
pip install -r requirements.txt
pytest
```
