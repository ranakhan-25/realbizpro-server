import { Injectable } from '@nestjs/common';
import { CreateProjectSiteDto } from './dto/create-project-site.dto';
import { UpdateProjectSiteDto } from './dto/update-project-site.dto';

@Injectable()
export class ProjectSiteService {
  create(createProjectSiteDto: CreateProjectSiteDto) {
    return 'This action adds a new projectSite';
  }

  findAll() {
    return `This action returns all projectSite`;
  }

  findOne(id: number) {
    return `This action returns a #${id} projectSite`;
  }

  update(id: number, updateProjectSiteDto: UpdateProjectSiteDto) {
    return `This action updates a #${id} projectSite`;
  }

  remove(id: number) {
    return `This action removes a #${id} projectSite`;
  }
}
