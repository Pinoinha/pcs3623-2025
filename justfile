default:
    just --list

run:
    uvicorn --app-dir "backend" app:app --reload &
    npm start --prefix "frontend"
