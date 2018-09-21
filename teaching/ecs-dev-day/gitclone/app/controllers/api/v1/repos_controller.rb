class Api::V1::ReposController < ApplicationController
  def create
    @repo = Repo.new(repo_params)

    if @repo.save
      render json: @repo, status: 201
    else
      render json: @repo.errors, status: 422
    end
  end

  private
  def repo_params
    params.require(:repo).permit(:name, :user_id)
  end
end
